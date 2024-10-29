import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetDelivererProfileUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-delivery-man-profile";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DelivererPresenter } from "../../presenters/deliverer-presenter";

const getDelivererProfileSchema = z.object({
  delivererId: z.string()
})

export type GetDelivererProfileSchema = z.infer<typeof getDelivererProfileSchema>

@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class GetDelivererProfileController {
  constructor(private getDelivererProfileUseCase: GetDelivererProfileUseCase) {}

  @ApiOperation({ summary: "Get deliverer profile" })
  @ApiResponse({ status: 200, description: "Deliverer profile retrieved", schema: {
    example: {
      deliverer: {
        id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
        name: 'John Doe',
        email: "johndoe@example.com",
        phone: "1234567890",
        rating: 4.5,
        deliveriesCount: 73,
        latitude: -23.5505199,
        longitude: -46.6333094,
        isAvailable: true,
        status: "ACTIVE",
        role: "DELIVERER",
        vehicle: "CHEVROLET ONIX",
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
        registeredAt: "2021-09-01T00:00:00Z",
        updatedAt: "2021-09-01T00:00:00Z",
      }
    }
  }})
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "Deliverer not found" })
  @ApiParam({ name: "delivererId", required: true, type: String })
  @ApiNotFoundResponse({ description: "Deliverer not found" })
  @ApiBadRequestResponse({ description: "Bad Request" })
  @Get("/deliverers/:delivererId")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getDelivererProfileSchema))
  async handle(
    @Param() params: GetDelivererProfileSchema
  ) {
    const { delivererId } = params

    const result = await this.getDelivererProfileUseCase.execute({ delivererId })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    const { deliverer } = result.value

    return { deliverer: DelivererPresenter.toHttp(deliverer) }
  }
}