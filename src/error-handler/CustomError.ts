// custom-error.ts
export class CustomError extends Error {
  constructor(public readonly code: string, public readonly status: number, message: string) {
    super(message);
  }
}