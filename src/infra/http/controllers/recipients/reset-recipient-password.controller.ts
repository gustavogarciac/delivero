import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { ResetRecipientPasswordUseCase } from "@/domain/logistics/application/use-cases/recipient/reset-recipient-password";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const resetRecipientPasswordSchema = z.object({
  email: z.string().email()
})

type ResetRecipientPasswordSchema = z.infer<typeof resetRecipientPasswordSchema>

@ApiTags("Recipients")
@Controller()
export class ResetRecipientPasswordController {
  constructor(private resetRecipientPasswordUseCase: ResetRecipientPasswordUseCase) {}

  @ApiOperation({ summary: "Reset recipient password" })
  @ApiResponse({ status: 201, description: "Recipient password reset successfully", schema: {
    example: {
      otp: "123456"
    }
  }})
  @ApiBody({ description: "Reset recipient password", schema: {
    example: {
      email: "johndoe@example.com"
    }
  }})
  @ApiBadRequestResponse({ description: "Bad request" })
  @Post("/sessions/recipients/reset-password")
  @Public()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(resetRecipientPasswordSchema)) body: ResetRecipientPasswordSchema
  ) {
    const { email } = body

    const result = await this.resetRecipientPasswordUseCase.execute({ email })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException("An unexpected error occurred")
      }
    }

    const { otp } = result.value

    return { otp }
  }
}