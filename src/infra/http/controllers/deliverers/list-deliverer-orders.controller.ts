import { BadRequestException, Controller, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ListOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/list-orders";
import { OrderPresenter } from "../../presenters/order-presenter";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const listDelivererOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional(),
})

const listDelivererOrdersParamSchema = z.object({
  delivererId: z.string()
})

type ListDelivererOrdersQuerySchema = z.infer<typeof listDelivererOrdersQuerySchema>
type ListDelivererOrdersParamSchema = z.infer<typeof listDelivererOrdersParamSchema>

const listDelivererOrdersQuerySchemaPipe = new ZodValidationPipe(listDelivererOrdersQuerySchema)
const listDelivererOrdersParamSchemaPipe = new ZodValidationPipe(listDelivererOrdersParamSchema)

@Controller()
export class ListDelivererOrdersController {
  constructor(private listDelivererOrdersUseCase: ListOrdersUseCase) {}

  @Get("/deliverers/:delivererId/orders")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(listDelivererOrdersQuerySchemaPipe) query: ListDelivererOrdersQuerySchema,
    @Param(listDelivererOrdersParamSchemaPipe) { delivererId }: ListDelivererOrdersParamSchema
  ) {
    const userId = user.sub

    if(userId !== delivererId) {
      throw new UnauthorizedException("You can only list your own orders")
    }

    const { page, perPage, count } = query

    const result = await this.listDelivererOrdersUseCase.execute({ 
      delivererId,
      page,
      perPage,
      count
    })

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