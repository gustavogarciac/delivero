import { Post, HttpCode, Body, Controller } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma/prisma.service";

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @Post()
  @HttpCode(200)
  async handle() {
    const token = this.jwt.sign({ sub: 'user-id' })

    const user = await this.prisma.user.create({
      data: {
        email: "johnDoe@example.com",
        cpf: "12345678900",
        password: "hashed-password",
      }
    })

    return { token, userId: user.id }
  }
}