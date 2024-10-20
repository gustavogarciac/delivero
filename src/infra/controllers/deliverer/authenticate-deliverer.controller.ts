import { BadRequestError } from "@/core/errors/bad-request-error";
import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { z } from "zod";

const authenticateDelivererBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateDelivererBodySchema = z.infer<typeof authenticateDelivererBodySchema>

@Controller()
export class AuthenticateDelivererController {
  constructor(private jwt: JwtService, private authenticateDelivererUseCase: AuthenticateDelivererUseCase) {}

  @Post('/sessions/deliverers')
  @HttpCode(201)
  @Public()
  @UsePipes(new ZodValidationPipe(authenticateDelivererBodySchema))
  async handle(@Body() body: AuthenticateDelivererBodySchema) {
    const { cpf, password } = body
    
    const result = await this.authenticateDelivererUseCase.execute({ cpf, password })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken
    }
  }
}