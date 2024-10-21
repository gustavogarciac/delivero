import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { ConfirmDelivererPasswordResetUseCase } from "@/domain/logistics/application/use-cases/deliverer/confirm-deliverer-password-reset";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";

const confirmDelivererPasswordResetSchema = z.object({
  delivererId: z.string(),
  newPassword: z.string().min(6),
  token: z.string()
})

type ConfirmDelivererPasswordResetSchema = z.infer<typeof confirmDelivererPasswordResetSchema>

@Controller()
export class ConfirmDelivererPasswordResetController {
  constructor(private confirmDelivererPasswordResetUseCase: ConfirmDelivererPasswordResetUseCase) {}

  @Post("/sessions/deliverers/confirm-password-reset")
  @HttpCode(204)
  @Public()
  @UsePipes(new ZodValidationPipe(confirmDelivererPasswordResetSchema))
  async handle(
    @Body() body: ConfirmDelivererPasswordResetSchema
  ) {
    const { delivererId, newPassword, token } = body

    const result = await this.confirmDelivererPasswordResetUseCase.execute({ delivererId, newPassword, token })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        case UnauthorizedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    return {}
  }
}