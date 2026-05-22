export class AppError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(message) {
    super(404, message, { error: "RESOURCE_NOT_FOUND" });
  }
}

export class ValidationError extends AppError {
  constructor(message, data = { error: "INVALID_REQUEST" }) {
    super(400, message, data);
  }
}

export class InvalidFileError extends AppError {
  constructor(message) {
    super(400, message, { error: "INVALID_FILE" });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(401, "Authentication failed", { error: message });
  }
}

export class AccessDeniedError extends AppError {
  constructor(message = "Access denied") {
    super(403, "Access denied", { error: message });
  }
}

export class FileStorageError extends AppError {
  constructor(message) {
    super(502, message, { error: "S3_OPERATION_FAILED" });
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message) {
    super(413, message, { error: "FILE_TOO_LARGE" });
  }
}
