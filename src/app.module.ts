import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BookmarkModule } from "./bookmark/bookmark.module";
import { PrismaModule } from "./prisma/prisma.module";
import { APP_FILTER } from "@nestjs/core";
import { CustomExceptionFilter } from "./error-handler/http-exception.filter";
import { NotFoundMiddleware } from "./error-handler/not-found.middleware";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, BookmarkModule, PrismaModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Register the NotFoundMiddleware as global middleware
    consumer.apply(NotFoundMiddleware).forRoutes({
      path: "api*",
      method: RequestMethod.ALL
    });
  }
}