import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET;
if (!CSRF_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("CSRF_SECRET must be defined in production environment.");
}

const SECRET = CSRF_SECRET || "FinGlide_Dedicated_CSRF_Secret_NonProd";

const HEX_REGEX = /^[a-f0-9]{64}$/i;

/**
 * Generate a deterministic session-bound HMAC CSRF token
 * @param {{ userId: string, sessionId: string }} param0 
 * @returns {string} token formatted as <hmac_hex>.<base64url_payload>
 */
export const generateCsrfToken = ({ userId, sessionId }) => {
  if (!userId || !sessionId) {
    throw new Error("userId and sessionId are required to generate CSRF token");
  }
  const payload = `${userId}:${sessionId}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${hmac}.${Buffer.from(payload).toString("base64url")}`;
};

/**
 * Verify incoming CSRF token against expected userId and sessionId
 * Uses regex validation and crypto.timingSafeEqual
 * @param {string} incomingToken 
 * @param {{ userId: string, sessionId: string }} expectedIdentity 
 * @returns {boolean}
 */
export const verifyCsrfToken = (incomingToken, { userId, sessionId }) => {
  if (!incomingToken || typeof incomingToken !== "string") {
    return false;
  }

  const parts = incomingToken.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [incomingHmac, base64Payload] = parts;

  // Validate incoming HMAC hex format
  if (!HEX_REGEX.test(incomingHmac)) {
    return false;
  }

  const decodedPayload = Buffer.from(base64Payload, "base64url").toString("utf-8");
  const expectedPayload = `${userId}:${sessionId}`;

  if (decodedPayload !== expectedPayload) {
    return false;
  }

  const expectedHmac = crypto.createHmac("sha256", SECRET).update(expectedPayload).digest("hex");

  const incomingBuffer = Buffer.from(incomingHmac, "hex");
  const expectedBuffer = Buffer.from(expectedHmac, "hex");

  if (incomingBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(incomingBuffer, expectedBuffer);
};
