import { BadRequestException, Controller, Delete, Get, HttpCode, Param, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetRecipientPreparingOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-preparing-orders";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

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

@ApiBearerAuth()
@ApiTags('Recipients')
@Controller()
export class GetRecipientPreparingOrdersController {
  constructor(private getRecipientPreparingOrdersUseCase: GetRecipientPreparingOrdersUseCase) {}

  @ApiOperation({ summary: 'Get recipient preparing orders' })
  @ApiParam({ name: 'recipientId', description: 'Recipient ID', required: true })
  @ApiQuery({ name: 'page', description: 'Page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', description: 'Per page', required: false, type: Number })
  @ApiQuery({ name: 'count', description: 'Count', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Recipient preparing orders', schema: {
    example: {
      orders: [
        {
          id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          recipientId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          delivererId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          status: 'PREPARING',
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
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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