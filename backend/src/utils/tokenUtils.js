import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.SECRET_CODE || "FinGlide_Access_Secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || (process.env.SECRET_CODE ? `${process.env.SECRET_CODE}_Refresh` : "FinGlide_Refresh_Secret");

export const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes (in seconds)
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days (in seconds)
export const ABSOLUTE_SESSION_EXPIRY = 30 * 24 * 60 * 60; // 30 days (in seconds)

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: `${ACCESS_TOKEN_EXPIRY}s`,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRY}s`,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const getCookieOptions = (isProduction = process.env.NODE_ENV === "production") => {
  return {
    accessCookieOptions: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: ACCESS_TOKEN_EXPIRY * 1000,
      path: "/",
    },
    refreshCookieOptions: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_TOKEN_EXPIRY * 1000,
      path: "/api/auth",
    },
  };
};

