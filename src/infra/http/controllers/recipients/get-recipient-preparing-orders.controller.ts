import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientPreparingOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-preparing-orders";

const getRecipientPreparingOrdersParamsSchema = z.object({
  recipientId: z.string(),
})

const getRecipientPreparingOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional().default(false),
})

type GetRecipientPreparingOrdersParamsSchema = z.infer<typeof getRecipientPreparingOrdersParamsSchema>
type GetRecipientPreparingOrdersQuerySchema = z.infer<typeof getRecipientPreparingOrdersQuerySchema>

@Controller()
export class GetRecipientPreparingOrdersController {
  constructor(private getRecipientPreparingOrdersUseCase: GetRecipientPreparingOrdersUseCase) {}

  @Get("/recipients/:recipientId/orders/preparing")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientPreparingOrdersParamsSchema)) params: GetRecipientPreparingOrdersParamsSchema,
    @Query(new ZodValidationPipe(getRecipientPreparingOrdersQuerySchema)) query: GetRecipientPreparingOrdersQuerySchema
  ) {
    const { recipientId } = params
    const { count, page, perPage } = query

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientPreparingOrdersUseCase.execute({ page, perPage, recipientId, count })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    const { items, total } = result.value

    return { orders: items.map(OrderPresenter.toHttp), total }
  }
}