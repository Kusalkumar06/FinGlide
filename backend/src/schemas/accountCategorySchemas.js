import { z } from "zod";

/**
 * Account & Category Validation Schemas (SEC-006)
 *
 * Rules:
 * - All schemas use .strict() to reject unknown properties, preventing mass assignment (e.g. userId, _id).
 * - ObjectId route params must be valid 24-char hex strings.
 * - Balance handles finite numbers and numeric strings without blindly coercing empty strings,
 *   booleans, arrays, or objects. Negative balances are permitted.
 * - Account & Category icons and types are validated against strictly verified enums.
 */

// MongoDB ObjectId route param schema
export const objectIdParamSchema = z
  .object({
    id: z
      .string({
        message: "Resource ID must be a string",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid resource ID format"),
  })
  .strict();

export const ACCOUNT_TYPES = [
  "wallet",
  "bank",
  "card",
  "investment",
  "crypto",
  "loan",
  "creditCard",
];

export const ACCOUNT_ICONS = [
  "cash",
  "credit-card",
  "piggy-bank",
  "wallet",
  "landmark",
  "bitcoin",
  "receipt",
];

// Custom balance validator: accepts finite numbers or non-empty numeric strings.
// Rejects booleans, null, undefined, arrays, objects, empty/whitespace strings, NaN, Infinity.
const balanceSchema = z
  .union([
    z.number({ message: "Balance must be a valid number" }),
    z.string({ message: "Balance must be a valid numeric string or number" }),
  ])
  .superRefine((val, ctx) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Balance cannot be empty or whitespace",
        });
        return;
      }
      const num = Number(trimmed);
      if (!Number.isFinite(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Balance must be a finite number",
        });
        return;
      }
      if (num < -999999999 || num > 999999999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Balance must be between -999,999,999 and 999,999,999",
        });
        return;
      }
    } else if (typeof val === "number") {
      if (!Number.isFinite(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Balance must be a finite number",
        });
        return;
      }
      if (val < -999999999 || val > 999999999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Balance must be between -999,999,999 and 999,999,999",
        });
        return;
      }
    }
  })
  .transform((val) => (typeof val === "string" ? Number(val.trim()) : val));

export const createAccountSchema = z
  .object({
    name: z
      .string({ message: "Account name is required" })
      .trim()
      .min(1, "Account name cannot be empty")
      .max(50, "Account name must not exceed 50 characters"),
    accountType: z.enum(ACCOUNT_TYPES, {
      message: "Invalid account type",
    }),
    balance: balanceSchema,
    accountNumber: z
      .string({ message: "Account number must be a string" })
      .trim()
      .max(50, "Account number must not exceed 50 characters")
      .default("N/A"),
    institution: z
      .string({ message: "Institution must be a string" })
      .trim()
      .max(50, "Institution must not exceed 50 characters")
      .default("N/A"),
    icon: z.enum(ACCOUNT_ICONS, {
      message: "Invalid account icon",
    }),
  })
  .strict();

export const updateAccountSchema = createAccountSchema;

export const CATEGORY_TYPES = ["Expense", "Income"];

export const CATEGORY_ICONS = [
  "home",
  "shopping-cart",
  "heart-pulse",
  "film",
  "check-circle",
  "dumbbell",
  "bus",
  "phone",
  "baby",
  "flower",
  "education",
  "currency",
  "car",
  "shirt",
  "utensils",
  "tags",
  "receipt",
  "lightbulb",
  "family",
];

export const createCategorySchema = z
  .object({
    name: z
      .string({ message: "Category name is required" })
      .trim()
      .min(1, "Category name cannot be empty")
      .max(50, "Category name must not exceed 50 characters"),
    categoryType: z.enum(CATEGORY_TYPES, {
      message: "Category type must be Expense or Income",
    }),
    icon: z.enum(CATEGORY_ICONS, {
      message: "Invalid category icon",
    }),
    description: z
      .string({ message: "Description must be a string" })
      .trim()
      .max(255, "Description must not exceed 255 characters")
      .default(""),
  })
  .strict();

export const updateCategorySchema = createCategorySchema;
