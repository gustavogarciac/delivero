import { BadRequestException, Controller, Get, HttpCode, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { GetOrderDetailsUseCase } from "@/domain/logistics/application/use-cases/orders/get-order-details";
import { OrderPresenter } from "../../presenters/order-presenter";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const getOrderDetailsParamSchema = z.object({
  orderId: z.string().uuid()
})

type GetOrderDetailsParamSchema = z.infer<typeof getOrderDetailsParamSchema>

@ApiTags("Orders")
@ApiBearerAuth()
@Controller()
export class GetOrderDetailsController {
  constructor(private getOrderDetailsUseCase: GetOrderDetailsUseCase) {}

  @ApiOperation({ summary: "Get order details" })
  @ApiResponse({ status: 200, description: "Order details retrieved", schema: {
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
  @ApiBadRequestResponse({ description: "Bad Request" })
  @Get("/orders/:orderId")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getOrderDetailsParamSchema))
  async handle(
    @Param() params: GetOrderDetailsParamSchema
  ) {
    const { orderId } = params

    const result = await this.getOrderDetailsUseCase.execute({ orderId })

    if(result.isLeft()) {
      const error = result.value

      if(error instanceof BadRequestError) {
        throw new BadRequestException('Invalid credentials')
      }

      throw new BadRequestException()
    }

    const { order } = result.value

    return { order: OrderPresenter.toHttp(order)}
  }
}