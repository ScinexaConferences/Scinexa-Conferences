import crypto from "node:crypto";

export function successResponse(message, data) {
  return {
    timestamp: new Date().toISOString(),
    success: true,
    message,
    data
  };
}

export function failureResponse(message, data) {
  return {
    timestamp: new Date().toISOString(),
    success: false,
    message,
    data
  };
}

export function asyncHandler(handler) {
  return async function wrappedHandler(req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export function shortCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export function normalizeRequiredText(value) {
  return String(value ?? "").trim();
}

export function normalizeOptionalText(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

export function toPublicId(document) {
  return document?._id?.toString?.() ?? document?.id ?? null;
}
