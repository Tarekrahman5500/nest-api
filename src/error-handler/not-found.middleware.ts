// not-found.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { NotFoundException } from './not-found.exception';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: Request) {
    throw new NotFoundException(`Path: ${req.originalUrl} not found`);
  }
}
