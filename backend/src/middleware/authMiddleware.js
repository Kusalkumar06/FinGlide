import "dotenv/config";
import { verifyAccessToken } from "../utils/tokenUtils.js";
import { SessionModel } from "../models/sessionModel.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken || req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      message: "Access token not provided",
      code: "TOKEN_MISSING",
    });
  }

  try {
    const verified = verifyAccessToken(token);

    if (!verified || !verified.userId || !verified.sessionId) {
      return res.status(401).json({
        message: "Invalid token payload: userId and sessionId required",
        code: "INVALID_TOKEN",
      });
    }

    // Active session verification in MongoDB
    const session = await SessionModel.findById(verified.sessionId);
    if (!session) {
      return res.status(401).json({
        message: "Session has been revoked or deleted",
        code: "SESSION_REVOKED",
      });
    }

    if (session.userId.toString() !== verified.userId.toString()) {
      return res.status(401).json({
        message: "Session does not match token user",
        code: "SESSION_USER_MISMATCH",
      });
    }

    const now = new Date();
    if (now > session.expiresAt || now > session.absoluteExpiresAt) {
      return res.status(401).json({
        message: "Session has expired",
        code: "SESSION_EXPIRED",
      });
    }

    req.user = {
      userId: verified.userId,
      username: verified.username,
      email: verified.email,
      sessionId: verified.sessionId,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      message: "Invalid access token",
      code: "INVALID_TOKEN",
    });
  }
};

