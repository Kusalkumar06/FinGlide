import { verifyCsrfToken } from "../utils/csrfUtils.js";
import { verifyRefreshToken, hashToken } from "../utils/tokenUtils.js";
import { SessionModel } from "../models/sessionModel.js";

const TRUSTED_ORIGINS = new Set([
  "http://localhost:5173",
  "https://finglide-gamma.vercel.app",
]);

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Origin and Referer validation middleware
 * Rejects untrusted origins on POST, PUT, PATCH, DELETE
 */
export const validateOrigin = (req, res, next) => {
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  let requestOrigin = req.headers.origin;

  if (!requestOrigin && req.headers.referer) {
    try {
      const parsedUrl = new URL(req.headers.referer);
      requestOrigin = parsedUrl.origin;
    } catch {
      return res.status(403).json({
        message: "Invalid referer header format",
        code: "CSRF_ORIGIN_INVALID",
      });
    }
  }

  if (!requestOrigin) {
    return res.status(403).json({
      message: "Origin or Referer header required for state-changing operations",
      code: "CSRF_ORIGIN_MISSING",
    });
  }

  if (!TRUSTED_ORIGINS.has(requestOrigin)) {
    return res.status(403).json({
      message: "Untrusted request origin",
      code: "CSRF_ORIGIN_UNTRUSTED",
    });
  }

  next();
};

/**
 * Validate CSRF token for authenticated requests
 * Requires req.user with userId and sessionId to be populated by authenticate middleware
 */
export const validateCsrfToken = (req, res, next) => {
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  if (!req.user || !req.user.userId || !req.user.sessionId) {
    return res.status(401).json({
      message: "Authentication required before CSRF validation",
      code: "AUTH_REQUIRED",
    });
  }

  const incomingToken = req.headers["x-csrf-token"];

  if (!incomingToken) {
    return res.status(403).json({
      message: "CSRF token missing from request headers",
      code: "CSRF_TOKEN_MISSING",
    });
  }

  const isValid = verifyCsrfToken(incomingToken, {
    userId: req.user.userId.toString(),
    sessionId: req.user.sessionId.toString(),
  });

  if (!isValid) {
    return res.status(403).json({
      message: "Invalid or mismatched CSRF token",
      code: "CSRF_TOKEN_INVALID",
    });
  }

  next();
};

/**
 * Middleware for POST /api/auth/refresh
 * Resolves session from refresh token and validates CSRF token before token rotation
 */
export const resolveRefreshSessionAndValidateCsrf = async (req, res, next) => {
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
    if (!userId || !sessionId) {
      return res.status(401).json({
        message: "Malformed refresh token payload",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) {
      return res.status(401).json({
        message: "Session not found or expired",
        code: "SESSION_EXPIRED",
      });
    }

    // Explicitly verify decoded identity matches MongoDB session
    if (
      session._id.toString() !== sessionId.toString() ||
      session.userId.toString() !== userId.toString()
    ) {
      return res.status(401).json({
        message: "Session identity mismatch",
        code: "SESSION_IDENTITY_MISMATCH",
      });
    }

    // Strict verification of refresh-token hash against session
    const incomingHash = hashToken(rawRefreshToken);
    if (session.refreshTokenHash !== incomingHash) {
      // Possible token theft / reuse detected! Terminate all user sessions.
      await SessionModel.deleteMany({ userId });
      const { getCookieOptions } = await import("../utils/tokenUtils.js");
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
    if (now > session.absoluteExpiresAt || now > session.expiresAt) {
      await SessionModel.findByIdAndDelete(sessionId);
      const { getCookieOptions } = await import("../utils/tokenUtils.js");
      const { accessCookieOptions, refreshCookieOptions } = getCookieOptions();
      res.clearCookie("accessToken", accessCookieOptions);
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(401).json({
        message: "Session reached maximum lifetime or expired. Please login again.",
        code: "SESSION_EXPIRED",
      });
    }

    const incomingToken = req.headers["x-csrf-token"];

    // Option B Bootstrap Exception:
    // If incomingToken is present, it MUST validate.
    // If incomingToken is absent (bootstrap after page reload), allow ONLY after all 6 preceding checks have passed.
    if (incomingToken) {
      const isValid = verifyCsrfToken(incomingToken, {
        userId: session.userId.toString(),
        sessionId: session._id.toString(),
      });

      if (!isValid) {
        return res.status(403).json({
          message: "Invalid or mismatched CSRF token",
          code: "CSRF_TOKEN_INVALID",
        });
      }
    }

    req.resolvedSession = session;
    req.refreshDecoded = decoded;
    next();
  } catch (err) {
    return res.status(500).json({
      message: `Error verifying refresh session: ${err.message}`,
    });
  }
};

/**
 * Middleware for POST /api/auth/logout
 * Resolves session and validates CSRF token before revoking session and clearing cookies
 */
export const resolveLogoutSessionAndValidateCsrf = async (req, res, next) => {
  try {
    let userId = null;
    let sessionId = null;

    // Check refresh token first as primary session identity
    const rawRefreshToken = req.cookies?.refreshToken;
    if (rawRefreshToken) {
      try {
        const decoded = verifyRefreshToken(rawRefreshToken);
        if (decoded?.sessionId && decoded?.userId) {
          userId = decoded.userId.toString();
          sessionId = decoded.sessionId.toString();
        }
      } catch {
        // Refresh token failed verification
      }
    }

    // Fallback to access token if refresh token was absent/unparseable
    if (!sessionId && req.cookies?.accessToken) {
      try {
        const { verifyAccessToken } = await import("../utils/tokenUtils.js");
        const verified = verifyAccessToken(req.cookies.accessToken);
        if (verified?.sessionId && verified?.userId) {
          userId = verified.userId.toString();
          sessionId = verified.sessionId.toString();
        }
      } catch {
        // Access token failed verification
      }
    }

    // If either token exists in cookies, a session identity must be resolved and validated against CSRF
    const hasCookies = Boolean(req.cookies?.refreshToken || req.cookies?.accessToken);

    if (hasCookies && (!userId || !sessionId)) {
      return res.status(401).json({
        message: "Invalid session credentials for logout",
        code: "INVALID_SESSION_CREDENTIALS",
      });
    }

    // Require valid CSRF token whenever an active session is present
    if (userId && sessionId) {
      const incomingToken = req.headers["x-csrf-token"];
      if (!incomingToken) {
        return res.status(403).json({
          message: "CSRF token missing from request headers",
          code: "CSRF_TOKEN_MISSING",
        });
      }

      const isValid = verifyCsrfToken(incomingToken, { userId, sessionId });
      if (!isValid) {
        return res.status(403).json({
          message: "Invalid or mismatched CSRF token",
          code: "CSRF_TOKEN_INVALID",
        });
      }

      req.logoutSessionId = sessionId;
      req.logoutUserId = userId;
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: `Error during logout CSRF validation: ${err.message}`,
    });
  }
};
