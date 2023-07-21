import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER } from "@nestjs/core";
import { CustomExceptionFilter } from "./error-handler/http-exception.filter";

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
