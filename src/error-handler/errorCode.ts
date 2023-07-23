// errorCode.ts


import { CustomError } from "./CustomError";

export class ErrorCode {
  public static readonly Unauthenticated = new CustomError('Unauthenticated', 401, 'User is not authenticated');
  public static readonly NotFound = new CustomError('NotFound', 404, 'Resource not found');
  public static readonly ValidationError = new CustomError('ValidationError', 400, 'Validation error');
  public static readonly AsyncError = new CustomError('AsyncError', 500, 'Async error');
  public static readonly UnknownError = new CustomError('UnknownError', 500, 'Unknown error');
  public static readonly Forbidden = new CustomError('Forbidden', 403, 'Forbidden');
}