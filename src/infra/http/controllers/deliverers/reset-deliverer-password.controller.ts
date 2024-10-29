import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ResetDelivererPasswordUseCase } from "@/domain/logistics/application/use-cases/deliverer/reset-password";
import { Public } from "@/infra/auth/public";
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const resetDelivererPasswordSchema = z.object({
  email: z.string().email()
})

type ResetDelivererPasswordSchema = z.infer<typeof resetDelivererPasswordSchema>

@ApiTags("Deliverers")
@Controller()
export class ResetDelivererPasswordController {
  constructor(private resetDelivererPasswordUseCase: ResetDelivererPasswordUseCase) {}

  @Post("/sessions/deliverers/reset-password")
  @Public()
  @ApiOperation({ summary: "Reset deliverer password" })
  @ApiBody({ schema: { example: { email: "user@email.com" } }, type: Boolean, required: true })
  @ApiResponse({ status: 201, description: "Password reset email sent successfully", schema: {
    example: {
      otp: "123456",
    }
  }})
  @ApiBadRequestResponse({ description: "Invalid data" })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(resetDelivererPasswordSchema)) body: ResetDelivererPasswordSchema
  ) {
    const { email } = body

    const result = await this.resetDelivererPasswordUseCase.execute({ email })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException("An unexpected error occurred")
      }
    }

    const { otp, sentEmail } = result.value

    return { otp, sentEmail }
  }
}