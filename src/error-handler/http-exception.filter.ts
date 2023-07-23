// custom-exception.filter.ts

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "./CustomError";
import {Request} from 'express';


@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    //const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    // console.log(exception);
    const { status, message } = this.getErrorMessage(exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorMessage(exception: any): { status: number; message: string } {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = exception as PrismaClientKnownRequestError;
      if (prismaError.code === "P2002") {
        status = HttpStatus.CONFLICT;
        message = `Duplicate value: ${prismaError.meta.target[0]}`;
      }
      // Handle other PrismaClientKnownRequestError codes here, if needed
    } else if (exception instanceof HttpException) {
      const httpException = exception as HttpException;
      if (httpException.getStatus() === HttpStatus.BAD_REQUEST) {
        // Form validation error response
        message = httpException.getResponse()["message"] || "Validation failed";
        status = HttpStatus.BAD_REQUEST;
      } else {
        status = httpException.getStatus();
        message = httpException.message;
      }

    } else if (exception instanceof TypeError) {
      // Provide a more descriptive error message for this specific TypeError
      message = `Invalid request: The provided user data is missing the required property hash`;
      status = HttpStatus.BAD_REQUEST;

    } else if (exception instanceof CustomError) {
      // Use the predefined status code and message from the CustomError
      status = exception.status;
      message = exception.message;
    }

    return { status, message };
  }
}