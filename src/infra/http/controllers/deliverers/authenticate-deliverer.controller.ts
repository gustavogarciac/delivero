import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const authenticateDelivererSchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

export type AuthenticateDelivererSchema = z.infer<typeof authenticateDelivererSchema>

@ApiTags("Deliverers")
@Controller()
export class AuthenticateDelivererController {
  constructor(private authenticateDelivererUseCase: AuthenticateDelivererUseCase) {}

  @Post("/sessions/deliverers")
  @HttpCode(201)
  @Public()
  @ApiOperation({ summary: "Authenticate a deliverer" })
  @UsePipes(new ZodValidationPipe(authenticateDelivererSchema))
  @ApiBody({ description: "Data needed to authenticate a deliverer", schema: {
    type: "object",
    properties: {
      cpf: { type: "string", example: "123.456.789-00", description: "CPF of the deliverer" },
      password: { type: "string", example: "password123", minLength: 6, description: "Password for the deliverer" }
    },
    required: ["cpf", "password"]
  }})
  @ApiResponse({ status: 201, description: 'Deliverer authenticated', schema: {
    example: {
      access_token: "0192da91-46b4-7999-b60e-82d7a0f2178f"
    }
  }})
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