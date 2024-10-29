import { BadRequestException, Body, Controller, Get, HttpCode, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { GetNearOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-near-orders";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

const getNearOrdersSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  maxDistance: z.coerce.number(),
  delivererId: z.string()
})

export type GetNearOrdersSchema = z.infer<typeof getNearOrdersSchema>

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
  @ApiBody({ description: "Get near orders", schema: {
    example: {
      latitude: -23.563987,
      longitude: -46.653252,
      maxDistance: 1000,
      delivererId: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
    }
  }})
  @Get("/near-orders")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getNearOrdersSchema))
  async handle(
    @Body() params: GetNearOrdersSchema
  ) {
    const { latitude, longitude, maxDistance, delivererId } = params

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