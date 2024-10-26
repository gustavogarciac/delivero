import { BadRequestException, Controller, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { PaginationParams } from "@/core/repositories/pagination";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { DelivererPresenter } from "../../presenters/deliverer-presenter";
import { ListPendingOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/list-pending-orders";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { OrderPresenter } from "../../presenters/order-presenter";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const paginationQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  per_page: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(1)),
  count: z.coerce.boolean().optional().default(false),
})

const listDelivererPendingOrdersParamSchema = z.object({
  delivererId: z.string().uuid(),
})

type PaginationQueryParamSchema = z.infer<typeof paginationQueryParamSchema>
type ListDelivererPendingOrdersParamSchema = z.infer<typeof listDelivererPendingOrdersParamSchema>

const paginationQueryValidationPipe = new ZodValidationPipe(
  paginationQueryParamSchema,
)

const listDelivererPendingOrdersParamSchemaValidationPipe = new ZodValidationPipe(
  listDelivererPendingOrdersParamSchema,
)


@Controller()
export class ListDelivererPendingOrdersController {
  constructor(private listDelivererPendingOrdersUseCase: ListPendingOrdersUseCase) {}

  @Get("/deliverers/:delivererId/orders/pending")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(paginationQueryValidationPipe) paginationParams: PaginationQueryParamSchema,
    @Param(listDelivererPendingOrdersParamSchemaValidationPipe) params: ListDelivererPendingOrdersParamSchema
  ) {
    const { page, per_page: perPage, count } = paginationParams
    const { delivererId } = params

    const userId = user.sub

    if(userId !== delivererId) {
      throw new UnauthorizedException("You can only list your own orders")
    }

    const result = await this.listDelivererPendingOrdersUseCase.execute({ page, perPage, count, delivererId })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException("An unexpected error occurred")
      }
    }

    const { items, total } = result.value

    return { orders: items.map(OrderPresenter.toHttp), total }
  }
}