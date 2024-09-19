import { Post, HttpCode, Body, Controller } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  @HttpCode(200)
  async handle() {
    const token = this.jwt.sign({ sub: 'user-id' })

    return { token }
  }
}