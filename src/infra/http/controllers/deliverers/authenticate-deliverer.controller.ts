import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";

const authenticateDelivererSchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

type AuthenticateDelivererSchema = z.infer<typeof authenticateDelivererSchema>

@Controller()
export class AuthenticateDelivererController {
  constructor(private authenticateDelivererUseCase: AuthenticateDelivererUseCase) {}

  @Post("/sessions/deliverers")
  @HttpCode(201)
  @Public()
  @UsePipes(new ZodValidationPipe(authenticateDelivererSchema))
  async handle(
    @Body() body: AuthenticateDelivererSchema
  ) {
    const { cpf, password } = body

    const result = await this.authenticateDelivererUseCase.execute({
      cpf,
      password
    })


    if(result.isLeft()) {
      const error = result.value

      if(error instanceof BadRequestError) {
        throw new BadRequestException('Invalid credentials')
      }

      throw new BadRequestException()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken
    }
  }
}