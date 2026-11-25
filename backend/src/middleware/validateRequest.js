/**
 * Generic request validation middleware using Zod.
 *
 * Supports validating req.body, req.query, and req.params against
 * supplied Zod schemas.
 *
 * Safe for Express 5 (does not blindly overwrite req.query getter).
 */

const formatZodIssues = (issues) => {
  return issues.map((issue) => {
    let field = issue.path.join(".");
    if (!field && issue.keys && issue.keys.length > 0) {
      field = issue.keys.join(", ");
    }
    return {
      field: field || "root",
      message: issue.message,
    };
  });
};

export const validateRequest = ({ body, query, params }) => {
  return async (req, res, next) => {
    const allErrors = [];
    const validatedData = {};

    try {
      if (body) {
        const bodyResult = await body.safeParseAsync(req.body);
        if (!bodyResult.success) {
          allErrors.push(...formatZodIssues(bodyResult.error.issues));
        } else {
          validatedData.body = bodyResult.data;
          req.body = bodyResult.data;
        }
      }

      if (query) {
        const queryResult = await query.safeParseAsync(req.query);
        if (!queryResult.success) {
          allErrors.push(...formatZodIssues(queryResult.error.issues));
        } else {
          validatedData.query = queryResult.data;
        }
      }

      if (params) {
        const paramsResult = await params.safeParseAsync(req.params);
        if (!paramsResult.success) {
          allErrors.push(...formatZodIssues(paramsResult.error.issues));
        } else {
          validatedData.params = paramsResult.data;
        }
      }

      if (allErrors.length > 0) {
        return res.status(400).json({
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          errors: allErrors,
        });
      }

      req.validated = validatedData;
      return next();
    } catch (err) {
      console.error("[validateRequest] Unexpected error during validation:", err);
      return res.status(500).json({
        message: "Internal server error during validation",
        code: "VALIDATION_SERVER_ERROR",
      });
    }
  };
};
