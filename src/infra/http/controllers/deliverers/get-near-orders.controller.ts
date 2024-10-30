import { BadRequestException, Body, Controller, Get, HttpCode, Param, Query, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { GetNearOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-near-orders";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderPresenter } from "../../presenters/order-presenter";

const getNearOrdersQuerySchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  maxDistance: z.coerce.number(),
})

const getNearOrdersParamSchema = z.object({
  delivererId: z.string().uuid(),
})

export type GetNearOrdersQuerySchema = z.infer<typeof getNearOrdersQuerySchema>
export type GetNearOrdersParamSchema = z.infer<typeof getNearOrdersParamSchema>

@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class GetNearOrdersController {
  constructor(private getNearOrdersUseCase: GetNearOrdersUseCase) {}

  @ApiOperation({ summary: "Get near orders" })
  @ApiResponse({ status: 200, description: "Success", schema: {
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
    }
  }})
  @ApiBadRequestResponse({ description: "Bad Request" })
  @ApiParam({ name: "delivererId", description: "Deliverer ID", required: true })
  @ApiQuery({ name: "latitude", description: "Latitude", required: true })
  @ApiQuery({ name: "longitude", description: "Longitude", required: true })
  @ApiQuery({ name: "maxDistance", description: "Max distance in kilometers", required: true })
  @Get("/deliverers/:delivererId/orders/near")
  @HttpCode(200)
  async handle(
    @Param(new ZodValidationPipe(getNearOrdersParamSchema)) params: GetNearOrdersParamSchema,
    @Query(new ZodValidationPipe(getNearOrdersQuerySchema)) query: GetNearOrdersQuerySchema
  ) {
    const { delivererId } = params
    const { latitude, longitude, maxDistance } = query

    const result = await this.getNearOrdersUseCase.execute({ 
      delivererId, 
      latitude, 
      longitude, 
      maxDistance
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

    const { orders } = result.value

    return { orders }
  }
}