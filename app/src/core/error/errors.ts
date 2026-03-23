export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = "UNKNOWN_ERROR",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network connection failed") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ServerError extends AppError {
  constructor(message: string = "Server error occurred") {
    super(message, "SERVER_ERROR");
    this.name = "ServerError";
  }
}

export const handleError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error?.response) {
    const status = error.response.status;
    const message = error.response.data?.error || error.message;

    switch (status) {
      case 401:
        return new UnauthorizedError(message);
      case 404:
        return new NotFoundError(message);
      case 422:
        return new ValidationError(message);
      case 500:
        return new ServerError(message);
      default:
        return new AppError(message, `HTTP_${status}`);
    }
  }

  if (error?.message?.includes("Network")) {
    return new NetworkError(error.message);
  }

  return new AppError(error?.message || "An unknown error occurred");
};
