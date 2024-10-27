import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientDetailsUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-details";
import { RecipientPresenter } from "../../presenters/recipient-presenter";

const getRecipientDetailsParamsSchema = z.object({
  recipientId: z.string(),
})

type GetRecipientDetailsParamsSchema = z.infer<typeof getRecipientDetailsParamsSchema>

@Controller()
export class GetRecipientDetailsController {
  constructor(private getRecipientDetailsUseCase: GetRecipientDetailsUseCase) {}

  @Get("/recipients/:recipientId")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientDetailsParamsSchema)) params: GetRecipientDetailsParamsSchema,
  ) {
    const { recipientId } = params

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientDetailsUseCase.execute({ recipientId })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    const { recipient } = result.value

    return { recipient: RecipientPresenter.toHttp(recipient) }
  }
}