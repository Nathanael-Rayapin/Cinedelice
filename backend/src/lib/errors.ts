export class HttpClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HttpClientError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends HttpClientError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpClientError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends HttpClientError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends HttpClientError {
  constructor(message: string) {
    super(message, 409);
  }
}
