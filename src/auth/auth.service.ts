import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {

  constructor(
    private prism: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {
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
    return this.signToken(user.id, user.email)
  }

  async signin(dto: AuthDto) {
    // find user by email

    const user = await this.prism.user.findUnique({
      where: {
        email: dto.email
      }
    });
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      //console.log("here");
      throw new NotFoundException(`path: /some-route not found`);
    }
    // send back user

    return this.signToken(user.id, user.email)
  }

  async signToken(userId: number, email: string): Promise<{access_token:string}> {

    const payload = {
      sub: userId,
      email
    };
    const secret = this.config.get("JWT_SECRET");
    const token = await this.jwt.signAsync(payload, {
      expiresIn: "2d",
      secret: secret
    });
    return {
        access_token: token
    }
  }


}





