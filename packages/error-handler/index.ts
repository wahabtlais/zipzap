export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this); // Capture the stack trace for better debugging
  }
}

// Not found error handler
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details?: any) {
    super(message, 404, true, details);
  }
}

// Validation error handler
export class ValidationError extends AppError {
  constructor(
    message: string = "Validation error: Invalid request data",
    details?: any
  ) {
    super(message, 422, true, details);
  }
}

// Authentication error handler
export class AuthError extends AppError {
  constructor(
    message: string = "Authentication error: Invalid credentials",
    details?: any
  ) {
    super(message, 401, true, details);
  }
}

// Forbidden error handler
export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden: You do not have permission to access this resource",
    details?: any
  ) {
    super(message, 403, true, details);
  }
}

// Database error handler
export class DatabaseError extends AppError {
  constructor(
    message: string = "Database error: Unable to connect to the database",
    details?: any
  ) {
    super(message, 500, true, details);
  }
}

// Rate limit error handler
export class RateLimitError extends AppError {
  constructor(
    message: string = "Rate limit exceeded: Too many requests",
    details?: any
  ) {
    super(message, 429, true, details);
  }
}
