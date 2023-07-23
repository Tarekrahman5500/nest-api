// not-found.exception.ts
import { HttpStatus, HttpException } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super({ statusCode: HttpStatus.NOT_FOUND, message }, HttpStatus.NOT_FOUND);
  }
}
