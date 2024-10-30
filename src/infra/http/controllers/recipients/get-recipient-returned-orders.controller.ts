import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientReturnedOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-returned-orders";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

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

@ApiBearerAuth()
@ApiTags("Recipients")
@Controller()
export class GetRecipientReturnedOrdersController {
  constructor(private getRecipientReturnedOrdersUseCase: GetRecipientReturnedOrdersUseCase) {}

  @ApiOperation({ summary: "Get recipient returned orders" })
  @ApiParam({ name: "recipientId", type: String })
  @ApiQuery({ name: "page", type: Number, required: false })
  @ApiQuery({ name: "perPage", type: Number, required: false })
  @ApiQuery({ name: "count", type: Boolean, required: false })
  @ApiResponse({ status: 200, description: "Recipient returned orders successfully fetched", schema: {
    example: {
      orders: [
        {
          id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          recipientId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          delivererId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          status: 'RETURNED',
          deliveryAddress: 'Rua da Consolação, 1000',
          geo: {
            latitude: -23.5505199,
            longitude: -46.6333094,
          },
          trackingCode: "321321342",
          notes: 'Do not bend',
          pickedAt: "",
          deliveredAt: '2021-09-01T00:00:00Z',
          updatedAt: '2021-09-01T00:00:00Z',
          returnedAt: '2021-09-01T00:00:00Z',
        }
      ],
      total: 1
    }
  }})
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