import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { GetRecipientAwaitingPickupOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-awaiting-pickup-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";


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

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller()
export class GetRecipientAwaitingPickupOrdersController {
  constructor(private getRecipientAwaitingPickupOrdersUseCase: GetRecipientAwaitingPickupOrdersUseCase) {}

  @ApiOperation({ summary: 'Get recipient awaiting pickup orders' })
  @ApiParam({ name: 'recipientId', description: 'Recipient ID', required: true })
  @ApiQuery({ name: 'page', description: 'Page', required: false })
  @ApiQuery({ name: 'perPage', description: 'Per page', required: false })
  @ApiQuery({ name: 'count', description: 'Count', required: false })
  @ApiResponse({ status: 200, description: 'Recipient awaiting pickup orders', schema: {
    example: {
      order: {
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
    }
  }})
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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