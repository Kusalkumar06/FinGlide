import "dotenv/config";
import { verifyAccessToken } from "../utils/tokenUtils.js";

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

    if (!verified || !verified.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
        code: "INVALID_TOKEN",
      });
    }

    req.user = {
      userId: verified.userId,
      username: verified.username,
      email: verified.email,
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
