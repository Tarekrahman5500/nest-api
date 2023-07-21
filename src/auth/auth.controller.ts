import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDto } from "./dto";
import { CustomExceptionFilter } from "../error-handler/http-exception.filter";
//import { HttpExceptionFilter } from "../error-handler/http-exception.filter";

@Controller('auth')
@UseFilters(new CustomExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}
  

  @Post('signup')
  signup(@Body() dto: AuthDto) {

    return this.authService.signup(dto);
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
