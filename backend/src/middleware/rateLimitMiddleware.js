import { rateLimit } from "express-rate-limit";

/**
 * Rate limiter for /api/auth/login
 * Policy:
 * - 5 failed attempts per IP within a 15-minute window
 * - Successful login requests (2xx) do not consume the failure quota
 * - Returns generic HTTP 429 when quota is exceeded
 * - Standard draft-8 / RFC rate-limit headers enabled; legacy X-RateLimit headers disabled
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 requests max
  skipSuccessfulRequests: true, // Only failed requests count against failure quota
  standardHeaders: "draft-8", // Enables RateLimit headers (draft-8 / RFC standard)
  legacyHeaders: false, // Disables X-RateLimit-* legacy headers
  statusCode: 429,
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
    code: "TOO_MANY_REQUESTS",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate limiter for /api/auth/register
 * Policy:
 * - 5 requests per IP per 1 hour
 * - Both successful and failed registration attempts count against the quota
 * - Returns generic HTTP 429 when quota is exceeded
 * - Standard draft-8 / RFC rate-limit headers enabled; legacy X-RateLimit headers disabled
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // 5 requests max
  skipSuccessfulRequests: false, // All attempts count against registration quota
  standardHeaders: "draft-8", // Enables RateLimit headers
  legacyHeaders: false, // Disables X-RateLimit-* legacy headers
  statusCode: 429,
  message: {
    message: "Too many registration attempts. Please try again later.",
    code: "TOO_MANY_REQUESTS",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});
