import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { ConfirmRecipientPasswordResetUseCase } from "@/domain/logistics/application/use-cases/recipient/confirm-recipient-password-reset";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";

const confirmRecipientPasswordResetSchema = z.object({
  recipientId: z.string(),
  newPassword: z.string().min(6),
  token: z.string()
})

type ConfirmRecipientPasswordResetSchema = z.infer<typeof confirmRecipientPasswordResetSchema>

@Controller()
export class ConfirmRecipientPasswordResetController {
  constructor(private confirmRecipientPasswordResetUseCase: ConfirmRecipientPasswordResetUseCase) {}

  @Post("/sessions/recipients/confirm-password-reset")
  @HttpCode(204)
  @Public()
  @UsePipes(new ZodValidationPipe(confirmRecipientPasswordResetSchema))
  async handle(
    @Body() body: ConfirmRecipientPasswordResetSchema
  ) {
    const { recipientId, newPassword, token } = body

    const result = await this.confirmRecipientPasswordResetUseCase.execute({ recipientId, newPassword, token })

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