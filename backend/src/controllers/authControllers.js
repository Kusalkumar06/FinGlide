import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel.js";
import { CategoryModel } from "../models/categoryModel.js";
import { AccountModel } from "../models/accountModel.js";
import { SessionModel } from "../models/sessionModel.js";
import "dotenv/config";
import { defaultCategories, defaultAccounts } from "../default.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
  getCookieOptions,
  REFRESH_TOKEN_EXPIRY,
  ABSOLUTE_SESSION_EXPIRY,
} from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const exsisting_user = await UserModel.findOne({ username });
    if (exsisting_user) {
      return res.status(400).json({
        message: "User already exists. Try using another name.",
        error: true,
        user: exsisting_user,
      });
    } else {
      const hashed_pass = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        username,
        email,
        password: hashed_pass,
      });

      const accountsWithuser = defaultAccounts.map((acc) => ({
        userId: newUser._id,
        ...acc,
      }));

      await AccountModel.insertMany(accountsWithuser);

      const categoriesWithuser = defaultCategories.map((cate) => ({
        userId: newUser._id,
        ...cate,
      }));

      await CategoryModel.insertMany(categoriesWithuser);

      res.status(201).json({
        message: "User created successfully.",
        result: newUser,
        error: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `Something went wrong during registration. Error: ${err}`,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({
        message: "User is not registered yet.",
      });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid Credentials.",
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRY * 1000);
    const absoluteExpiresAt = new Date(now.getTime() + ABSOLUTE_SESSION_EXPIRY * 1000);

    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress = req.ip || req.connection?.remoteAddress || "unknown";

    // Create session record placeholder to obtain sessionId
    const session = await SessionModel.create({
      userId: existingUser._id,
      refreshTokenHash: "pending",
      userAgent,
      ipAddress,
      expiresAt,
      absoluteExpiresAt,
    });

    const accessToken = generateAccessToken({
      userId: existingUser._id.toString(),
      username: existingUser.username,
      email: existingUser.email,
    });

    const refreshToken = generateRefreshToken({
      userId: existingUser._id.toString(),
      sessionId: session._id.toString(),
    });

    session.refreshTokenHash = hashToken(refreshToken);
    await session.save();

    const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Login Successful.",
      user: {
        userId: existingUser._id.toString(),
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: `Something went wrong during Authentication. Error: ${err}`,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(401).json({
        message: "Refresh token not provided",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(rawRefreshToken);
    } catch {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    const { userId, sessionId } = decoded;
    const session = await SessionModel.findById(sessionId);

    if (!session) {
      return res.status(401).json({
        message: "Session not found or expired",
        code: "SESSION_EXPIRED",
      });
    }

    const incomingHash = hashToken(rawRefreshToken);

    // Reuse detection
    if (session.refreshTokenHash !== incomingHash) {
      // Possible token theft! Invalidate all sessions for this user.
      await SessionModel.deleteMany({ userId });
      const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();
      res.clearCookie("accessToken", accessCookieOptions);
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(403).json({
        message: "Refresh token reuse detected. All sessions terminated.",
        code: "TOKEN_REUSE_DETECTED",
      });
    }

    // Absolute expiry check (30 days hard cap)
    const now = new Date();
    if (now > session.absoluteExpiresAt) {
      await SessionModel.findByIdAndDelete(sessionId);
      const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();
      res.clearCookie("accessToken", accessCookieOptions);
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(401).json({
        message: "Session reached absolute maximum lifetime. Please login again.",
        code: "SESSION_ABSOLUTE_TIMEOUT",
      });
    }

    // Generate new token pair (Rotation)
    const newAccessToken = generateAccessToken({
      userId: session.userId.toString(),
      username: req.user?.username || decoded.username,
    });

    const newRefreshToken = generateRefreshToken({
      userId: session.userId.toString(),
      sessionId: session._id.toString(),
    });

    // Update session: rotate hash & slide inactivity window by 7 days
    session.refreshTokenHash = hashToken(newRefreshToken);
    session.expiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRY * 1000);
    await session.save();

    const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();
    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Error during token refresh: ${err.message}`,
    });
  }
};

export const check = async (req, res) => {
  res.status(200).json({
    message: "User is authenticated",
    success: true,
    user: req.user,
  });
};

export const logout = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (rawRefreshToken) {
      try {
        const decoded = verifyRefreshToken(rawRefreshToken);
        if (decoded?.sessionId) {
          await SessionModel.findByIdAndDelete(decoded.sessionId);
        }
      } catch {
        // Token verification failed or already expired, still proceed to clear cookies
      }
    }

    const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();
    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);
    // Also clear legacy cookie if present
    res.clearCookie("authToken", { path: "/" });

    res.status(200).json({
      message: "User logged out",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error during logout: ${err.message}`,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const deletedUser = await UserModel.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();
    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);
    res.clearCookie("authToken", { path: "/" });

    res.status(200).json({
      message: "User and all related data deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: `Server error during deleting the User: ${err}`,
    });
  }
};
