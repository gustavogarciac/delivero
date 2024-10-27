import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { GetRecipientAwaitingPickupOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-awaiting-pickup-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";


const getRecipientAwaitingPickupOrdersParamsSchema = z.object({
  recipientId: z.string(),
})

const getRecipientAwaitingPickupOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional().default(false),
})

type GetRecipientAwaitingPickupOrdersParamsSchema = z.infer<typeof getRecipientAwaitingPickupOrdersParamsSchema>
type GetRecipientAwaitingPickupOrdersQuerySchema = z.infer<typeof getRecipientAwaitingPickupOrdersQuerySchema>

@Controller()
export class GetRecipientAwaitingPickupOrdersController {
  constructor(private getRecipientAwaitingPickupOrdersUseCase: GetRecipientAwaitingPickupOrdersUseCase) {}

  @Get("/recipients/:recipientId/orders/awaiting-pickup")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientAwaitingPickupOrdersParamsSchema)) params: GetRecipientAwaitingPickupOrdersParamsSchema,
    @Query(new ZodValidationPipe(getRecipientAwaitingPickupOrdersQuerySchema)) query: GetRecipientAwaitingPickupOrdersQuerySchema
  ) {
    const { recipientId } = params
    const { count, page, perPage } = query

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientAwaitingPickupOrdersUseCase.execute({ page, perPage, recipientId, count })

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