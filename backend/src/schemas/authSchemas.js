import { z } from "zod";

/**
 * Authentication Schemas
 *
 * Principles:
 * - Login: Broad compatibility so existing registered users are never locked out.
 *   Strict types (string only, rejects objects/arrays/numbers), bounded lengths,
 *   rejects empty strings, NO trimming of passwords (preserves intentional spaces).
 * - Registration: Strict bounded username, trimmed email, password policy.
 *   Unexpected fields are rejected (.strict()).
 */

export const loginSchema = z
  .object({
    username: z
      .string({
        message: "Username must be a valid string",
      })
      .min(1, "Username is required")
      .max(50, "Username must not exceed 50 characters"),
    password: z
      .string({
        message: "Password must be a valid string",
      })
      .min(1, "Password is required")
      .max(128, "Password must not exceed 128 characters"),
  })
  .strict();

export const registerSchema = z
  .object({
    username: z
      .string({
        message: "Username must be a valid string",
      })
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username may only contain letters, numbers, underscores, and hyphens"
      ),
    email: z
      .string({
        message: "Email must be a valid string",
      })
      .trim()
      .email("Invalid email address format")
      .max(100, "Email must not exceed 100 characters"),
    password: z
      .string({
        message: "Password must be a valid string",
      })
      .min(6, "Password must be at least 6 characters")
      .refine(
        (val) => Buffer.byteLength(val, "utf8") <= 72,
        {
          message: "Password must not exceed 72 bytes",
        }
      ),
  })
  .strict();

