import {
  AppError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ServerError,
  handleError,
} from "../src/core/error/errors";

describe("Error Classes", () => {
  describe("AppError", () => {
    it("should create AppError with message", () => {
      const error = new AppError("Test error", "TEST_ERROR");

      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_ERROR");
      expect(error instanceof Error).toBe(true);
    });

    it("should have default code", () => {
      const error = new AppError("Test error");

      expect(error.code).toBe("APP_ERROR");
    });
  });

  describe("NetworkError", () => {
    it("should create NetworkError", () => {
      const error = new NetworkError("Connection failed");

      expect(error.message).toBe("Connection failed");
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error instanceof AppError).toBe(true);
    });
  });

  describe("NotFoundError", () => {
    it("should create NotFoundError", () => {
      const error = new NotFoundError("Resource not found");

      expect(error.message).toBe("Resource not found");
      expect(error.code).toBe("NOT_FOUND");
    });
  });

  describe("UnauthorizedError", () => {
    it("should create UnauthorizedError", () => {
      const error = new UnauthorizedError("Invalid credentials");

      expect(error.message).toBe("Invalid credentials");
      expect(error.code).toBe("UNAUTHORIZED");
    });
  });

  describe("ValidationError", () => {
    it("should create ValidationError", () => {
      const error = new ValidationError("Invalid input", ["field1", "field2"]);

      expect(error.message).toBe("Invalid input");
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.fields).toEqual(["field1", "field2"]);
    });
  });

  describe("ServerError", () => {
    it("should create ServerError", () => {
      const error = new ServerError("Internal server error");

      expect(error.message).toBe("Internal server error");
      expect(error.code).toBe("SERVER_ERROR");
    });
  });
});

describe("handleError", () => {
  it("should convert axios network error to NetworkError", () => {
    const axiosError = {
      response: undefined,
      request: {},
      message: "Network error",
    };

    const result = handleError(axiosError as any);

    expect(result instanceof NetworkError).toBe(true);
    expect(result.message).toContain("Network error");
  });

  it("should convert 404 to NotFoundError", () => {
    const axiosError = {
      response: { status: 404, data: { message: "Not found" } },
    };

    const result = handleError(axiosError as any);

    expect(result instanceof NotFoundError).toBe(true);
  });

  it("should convert 401 to UnauthorizedError", () => {
    const axiosError = {
      response: { status: 401, data: { message: "Unauthorized" } },
    };

    const result = handleError(axiosError as any);

    expect(result instanceof UnauthorizedError).toBe(true);
  });

  it("should convert 400 to ValidationError", () => {
    const axiosError = {
      response: {
        status: 400,
        data: { message: "Validation error", fields: ["field1"] },
      },
    };

    const result = handleError(axiosError as any);

    expect(result instanceof ValidationError).toBe(true);
  });

  it("should convert 500 to ServerError", () => {
    const axiosError = {
      response: { status: 500, data: { message: "Server error" } },
    };

    const result = handleError(axiosError as any);

    expect(result instanceof ServerError).toBe(true);
  });

  it("should handle generic Error", () => {
    const error = new Error("Generic error");

    const result = handleError(error);

    expect(result instanceof AppError).toBe(true);
    expect(result.message).toBe("Generic error");
  });

  it("should handle string errors", () => {
    const result = handleError("String error");

    expect(result instanceof AppError).toBe(true);
    expect(result.message).toBe("String error");
  });
});
