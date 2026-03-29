export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network connection failed") {
    super(message, 0);
    this.name = "NetworkError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
    this.name = "ValidationError";
  }
}

export class ServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
    this.name = "ServerError";
  }
}

export function handleError(statusCode: number, message?: string): AppError {
  switch (statusCode) {
    case 401:
      return new UnauthorizedError(message);
    case 404:
      return new NotFoundError(message);
    case 422:
      return new ValidationError(message);
    case 500:
      return new ServerError(message);
    default:
      return new AppError(message ?? "An error occurred", statusCode);
  }
}
