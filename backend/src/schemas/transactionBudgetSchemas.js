import { z } from "zod";

/**
 * Transaction & Budget Validation Schemas (SEC-007)
 *
 * Requirements:
 * - Stricter positive financial amount policy:
 *   - Accept normal numbers and numeric strings from HTML inputs
 *   - Accept: "1", "12", "12.3", "12.34", "150.50"
 *   - Reject: "0", "0.0", "0.00", "000", "-1", "1.234", empty strings, whitespace-only strings
 *   - Reject hexadecimal (0x...), binary (0b...), octal (0o...), and scientific notation (1e3)
 *   - Maximum amount 999,999,999 with at most 2 decimal places (standard currency)
 *   - Convert to number only after all checks pass
 *   - Explicitly verify converted value is finite and > 0
 * - 24-character hexadecimal ObjectId parameter validation
 * - Conditional transaction fields enforced both ways:
 *   - Transfer: fromAccountId & toAccountId required (and must be distinct); accountId & categoryId must be null or absent
 *   - Income / Expense: accountId & categoryId required; fromAccountId & toAccountId must be null or absent
 * - Date validation: ISO string, optional (defaults to Date.now in DB if omitted)
 * - Strict rejection of unknown properties (_id, userId, etc.)
 */

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdParamSchema = z
  .object({
    id: z
      .string({ message: "Resource ID must be a string" })
      .regex(objectIdRegex, "Invalid resource ID format"),
  })
  .strict();

// Matches either:
// 1) Positive integer or decimal with positive whole: ^[1-9]\d*(?:\.\d{1,2})?$
// 2) Decimal with 0 whole and at least one non-zero digit in fractional part: ^0\.(?:0[1-9]|[1-9]\d?)$
// Explicitly rejects "0", "0.0", "0.00", "000", leading zeros on whole part ("01"), negatives, and >2 decimals
const STRICT_MONEY_REGEX = /^(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:0[1-9]|[1-9]\d?))$/;

const positiveMoneySchema = z
  .union([
    z.number({ message: "Amount must be a valid number" }),
    z.string({ message: "Amount must be a numeric string or number" }),
  ])
  .superRefine((val, ctx) => {
    let strVal;
    let numVal;

    if (typeof val === "string") {
      strVal = val.trim();
      if (!STRICT_MONEY_REGEX.test(strVal)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Amount must be a positive decimal number with up to 2 decimal places (scientific notation, hex, zero, and negative values are not allowed)",
        });
        return;
      }
      numVal = Number(strVal);
      if (!Number.isFinite(numVal) || numVal <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount must be a finite positive number greater than zero",
        });
        return;
      }
    } else {
      if (!Number.isFinite(val) || val <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount must be a finite positive number greater than zero",
        });
        return;
      }
      strVal = val.toString();
      if (strVal.includes("e") || strVal.includes("E")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Scientific notation is not permitted",
        });
        return;
      }
      const parts = strVal.split(".");
      if (parts.length > 1 && parts[1].length > 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount cannot have more than 2 decimal places",
        });
        return;
      }
      numVal = val;
    }

    if (numVal > 999999999) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount exceeds maximum limit of 999,999,999",
      });
      return;
    }
  })
  .transform((val) => (typeof val === "string" ? Number(val.trim()) : val));

// Base transaction fields
export const createTransactionSchema = z
  .object({
    description: z
      .string({ message: "Description is required" })
      .trim()
      .min(1, "Description cannot be empty")
      .max(100, "Description must not exceed 100 characters"),
    transactionType: z.enum(["Income", "Expense", "Transfer"], {
      message: "Transaction type must be Income, Expense, or Transfer",
    }),
    amount: positiveMoneySchema,
    categoryId: z
      .string()
      .regex(objectIdRegex, "Invalid category ID")
      .nullable()
      .optional(),
    accountId: z
      .string()
      .regex(objectIdRegex, "Invalid account ID")
      .nullable()
      .optional(),
    fromAccountId: z
      .string()
      .regex(objectIdRegex, "Invalid from-account ID")
      .nullable()
      .optional(),
    toAccountId: z
      .string()
      .regex(objectIdRegex, "Invalid to-account ID")
      .nullable()
      .optional(),
    date: z
      .string()
      .datetime({ offset: true, message: "Date must be a valid ISO-8601 string" })
      .optional(),
    notes: z
      .string({ message: "Notes must be a string" })
      .trim()
      .max(500, "Notes must not exceed 500 characters")
      .default(""),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.transactionType === "Transfer") {
      // Transfer must have fromAccountId and toAccountId
      if (!data.fromAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fromAccountId"],
          message: "Source account is required for transfers",
        });
      }
      if (!data.toAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toAccountId"],
          message: "Destination account is required for transfers",
        });
      }
      if (data.fromAccountId && data.toAccountId && data.fromAccountId === data.toAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toAccountId"],
          message: "Source and destination accounts must be different",
        });
      }
      // Contradictory check: accountId and categoryId MUST NOT be provided on Transfer
      if (data.accountId !== undefined && data.accountId !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["accountId"],
          message: "accountId must not be provided for Transfer transactions",
        });
      }
      if (data.categoryId !== undefined && data.categoryId !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryId"],
          message: "categoryId must not be provided for Transfer transactions",
        });
      }
    } else {
      // Income or Expense
      if (!data.accountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["accountId"],
          message: "Account is required for Income/Expense transactions",
        });
      }
      if (!data.categoryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryId"],
          message: "Category is required for Income/Expense transactions",
        });
      }
      // Contradictory check: fromAccountId and toAccountId MUST NOT be provided
      if (data.fromAccountId !== undefined && data.fromAccountId !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fromAccountId"],
          message: "fromAccountId must not be provided for Income/Expense transactions",
        });
      }
      if (data.toAccountId !== undefined && data.toAccountId !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toAccountId"],
          message: "toAccountId must not be provided for Income/Expense transactions",
        });
      }
    }
  });

export const updateTransactionSchema = createTransactionSchema;

export const createBudgetSchema = z
  .object({
    categoryId: z
      .string({ message: "Category ID is required" })
      .regex(objectIdRegex, "Invalid category ID"),
    limit: positiveMoneySchema,
    period: z
      .enum(["monthly", "yearly", "weekly"], {
        message: "Period must be monthly, yearly, or weekly",
      })
      .default("monthly"),
  })
  .strict();

export const updateBudgetSchema = createBudgetSchema;
