// custom-exception.filter.ts

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error ";
    if (exception.code === "P2002") {
      message = `Duplicate value: ${exception.meta.target[0]}`;
      status = 404;
    }

    //console.log(message);

    //  console.log(exception)
    response.status(status).json({
      statusCode: status,
      message
    });
  }
}
