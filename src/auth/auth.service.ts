import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";

@Injectable()
export class AuthService {

  constructor(private prism: PrismaService) {
  }

  login() {
  }

  async signup(dto: AuthDto) {
    // generate the hash password
    const hash = await argon.hash(dto.password);
    //save new user
    const user = await this.prism.user.create({
      data: {
        email: dto.email,
        hash
      }
    });
    // return the user
    return { user, message: "user Successfully created" };
  }

  signin() {
    return { message: "I have signed in" };
  }
}
