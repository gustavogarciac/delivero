import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientReturnedOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-returned-orders";

const getRecipientReturnedOrdersParamsSchema = z.object({
  recipientId: z.string(),
})

const getRecipientReturnedOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional().default(false),
})

type GetRecipientReturnedOrdersParamsSchema = z.infer<typeof getRecipientReturnedOrdersParamsSchema>
type GetRecipientReturnedOrdersQuerySchema = z.infer<typeof getRecipientReturnedOrdersQuerySchema>

@Controller()
export class GetRecipientReturnedOrdersController {
  constructor(private getRecipientReturnedOrdersUseCase: GetRecipientReturnedOrdersUseCase) {}

  @Get("/recipients/:recipientId/orders/returned")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientReturnedOrdersParamsSchema)) params: GetRecipientReturnedOrdersParamsSchema,
    @Query(new ZodValidationPipe(getRecipientReturnedOrdersQuerySchema)) query: GetRecipientReturnedOrdersQuerySchema
  ) {
    const { recipientId } = params
    const { count, page, perPage } = query

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientReturnedOrdersUseCase.execute({ page, perPage, recipientId, count })

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