import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import { ValidationPipe } from "@nestjs/common";
import { CustomExceptionFilter } from "./error-handler/http-exception.filter";
//import { HttpExceptionFilter } from "./error-handler/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.use(morgan("dev"));
   // Set a global prefix  application (e.g., '/api')
  app.setGlobalPrefix('/api');
  await app.listen(5000);
}

bootstrap();
