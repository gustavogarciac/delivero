import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CreateOrderUseCase } from "@/domain/logistics/application/use-cases/orders/create-order";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const createOrderSchema = z.object({
  delivererId: z.string().optional(),
  recipientId: z.string(),
  adminId: z.string().optional(),
  deliveryAddress: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  notes: z.string().optional(),
})

type CreateOrderSchema = z.infer<typeof createOrderSchema>

@ApiTags("Orders")
@ApiBearerAuth()
@Controller()
export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @ApiOperation({ summary: "Create order" })
  @ApiBody({ description: "Create order", schema: {
    example: {
      delivererId: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
      recipientId: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
      adminId: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
      deliveryAddress: "Rua da Consolação, 1000",
      latitude: -23.5505199,
      longitude: -46.6333094,
      notes: "Do not bend"
    }
  }})
  @ApiResponse({ status: 201, description: "Order created", schema: {
    example: {
      orderId: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
    }
  }})
  @ApiBadRequestResponse({ description: "Bad Request" })
  @Post("/orders")
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async handle(
    @Body() body: CreateOrderSchema
  ) {
    const {
      deliveryAddress,
      latitude,
      longitude,
      recipientId,
      adminId,
      delivererId,
      notes
    } = body

    const result = await this.createOrderUseCase.execute({
      deliveryAddress,
      geo: Geolocalization.create({ latitude, longitude }),
      delivererId,
      recipientId,
      adminId,
      notes
    })

    if(result.isLeft()) {
      const error = result.value

      if(error instanceof BadRequestError) {
        throw new BadRequestException('Invalid credentials')
      }

      throw new BadRequestException()
    }

    const { order } = result.value

    return {
      orderId: order.id.toString()
    }
  }
}