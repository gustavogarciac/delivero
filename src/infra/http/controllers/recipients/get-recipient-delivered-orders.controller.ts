import { BadRequestException, Controller, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientDeliveredOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-delivered-orders";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";


const getRecipientDeliveredOrdersParamsSchema = z.object({
  recipientId: z.string(),
})

const getRecipientDeliveredOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional().default(false),
})

type GetRecipientDeliveredOrdersParamsSchema = z.infer<typeof getRecipientDeliveredOrdersParamsSchema>
type GetRecipientDeliveredOrdersQuerySchema = z.infer<typeof getRecipientDeliveredOrdersQuerySchema>

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller()
export class GetRecipientDeliveredOrdersController {
  constructor(private getRecipientDeliveredOrdersUseCase: GetRecipientDeliveredOrdersUseCase) {}

  @ApiOperation({ summary: 'Get recipient delivered orders' })
  @ApiParam({ name: 'recipientId', description: 'Recipient ID', required: true })
  @ApiQuery({ name: 'page', description: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', description: 'Per page', required: false, type: Number })
  @ApiQuery({ name: 'count', description: 'Count', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Recipient delivered orders', schema: {
    example: {
      orders: [
        {
          id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          recipientId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          delivererId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          status: 'DELIVERED',
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
  @Get("/recipients/:recipientId/orders/delivered")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientDeliveredOrdersParamsSchema)) params: GetRecipientDeliveredOrdersParamsSchema,
    @Query(new ZodValidationPipe(getRecipientDeliveredOrdersQuerySchema)) query: GetRecipientDeliveredOrdersQuerySchema
  ) {
    const { recipientId } = params
    const { count, page, perPage } = query

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientDeliveredOrdersUseCase.execute({ page, perPage, recipientId, count })

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