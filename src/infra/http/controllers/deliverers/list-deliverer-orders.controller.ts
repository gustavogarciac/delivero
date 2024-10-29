import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ListOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/list-orders";
import { OrderPresenter } from "../../presenters/order-presenter";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Controller, Get, HttpCode, Query, Param, UnauthorizedException, BadRequestException } from '@nestjs/common';

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


@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class ListDelivererOrdersController {
  constructor(private listDelivererOrdersUseCase: ListOrdersUseCase) {}

  @Get("/deliverers/:delivererId/orders")
  @HttpCode(200)
  @ApiOperation({ summary: "List orders for a deliverer" })
  @ApiParam({ name: 'delivererId', description: 'ID of the deliverer', required: true })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false })
  @ApiQuery({ name: 'perPage', description: 'Number of items per page', required: false })
  @ApiQuery({ name: 'count', description: 'Include count of total items', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Orders list successfully retrieved', schema: {
    example: {
      orders: [
        {
          id: 'order-id',
          status: 'DELIVERED',
          pickupCode: 'pickup-code',
          deliveryAddress: 'address',
          latitude: 12.34567,
          longitude: 54.321,
          trackingCode: 'tracking-code',
          notes: 'Any notes',
          pickedAt: 'date',
          deliveredAt: 'date',
          returnedAt: null,
          createdAt: 'date',
          updatedAt: 'date'
        }
      ],
      total: 100
    }
  }})
  @ApiUnauthorizedResponse({ description: 'You can only list your own orders' })
  @ApiBadRequestResponse({ description: 'Invalid parameters or bad request' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(listDelivererOrdersQuerySchemaPipe) query: ListDelivererOrdersQuerySchema,
    @Param(listDelivererOrdersParamSchemaPipe) { delivererId }: ListDelivererOrdersParamSchema
  ) {
    const userId = user.sub;

    if (userId !== delivererId) {
      throw new UnauthorizedException("You can only list your own orders");
    }

    const { page, perPage, count } = query;

    const result = await this.listDelivererOrdersUseCase.execute({ 
      delivererId,
      page,
      perPage,
      count
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      } 
    }

    const { items, total } = result.value;

    return { orders: items.map(OrderPresenter.toHttp), total };
  }
}
