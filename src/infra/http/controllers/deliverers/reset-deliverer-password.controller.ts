import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ResetDelivererPasswordUseCase } from "@/domain/logistics/application/use-cases/deliverer/reset-password";

const resetDelivererPasswordSchema = z.object({
  email: z.string().email()
})

type ResetDelivererPasswordSchema = z.infer<typeof resetDelivererPasswordSchema>

@Controller()
export class ResetDelivererPasswordController {
  constructor(private resetDelivererPasswordUseCase: ResetDelivererPasswordUseCase) {}

  @Post("/sessions/deliverers/reset-password")
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