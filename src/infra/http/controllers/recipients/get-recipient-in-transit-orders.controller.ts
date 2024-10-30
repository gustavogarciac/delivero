import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientInTransitOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-in-transit-orders";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";



const getRecipientInTransitOrdersParamsSchema = z.object({
  recipientId: z.string(),
})

const getRecipientInTransitOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional().default(false),
})

type GetRecipientInTransitOrdersParamsSchema = z.infer<typeof getRecipientInTransitOrdersParamsSchema>
type GetRecipientInTransitOrdersQuerySchema = z.infer<typeof getRecipientInTransitOrdersQuerySchema>

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller()
export class GetRecipientInTransitOrdersController {
  constructor(private getRecipientInTransitOrdersUseCase: GetRecipientInTransitOrdersUseCase) {}

  @ApiOperation({ summary: 'Get recipient in transit orders' })
  @ApiParam({ name: 'recipientId', description: 'Recipient ID', required: true })
  @ApiQuery({ name: 'page', description: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', description: 'Per page', required: false, type: Number })
  @ApiQuery({ name: 'count', description: 'Count', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: "Recipient in transit orders", schema: {
    example: {
      orders: [
        {
          id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          recipientId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          delivererId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          status: 'IN_TRANSIT',
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
  @Get("/recipients/:recipientId/orders/in-transit")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientInTransitOrdersParamsSchema)) params: GetRecipientInTransitOrdersParamsSchema,
    @Query(new ZodValidationPipe(getRecipientInTransitOrdersQuerySchema)) query: GetRecipientInTransitOrdersQuerySchema
  ) {
    const { recipientId } = params
    const { count, page, perPage } = query

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientInTransitOrdersUseCase.execute({ page, perPage, recipientId, count })

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