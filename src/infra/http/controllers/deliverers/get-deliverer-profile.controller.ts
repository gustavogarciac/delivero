import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetDelivererProfileUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-delivery-man-profile";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DelivererPresenter } from "../../presenters/deliverer-presenter";
import { GetDelivererProfileResponseDTO } from "./docs/get-deliverer-profile.controller.docs";

const getDelivererProfileSchema = z.object({
  delivererId: z.string()
})

export type GetDelivererProfileSchema = z.infer<typeof getDelivererProfileSchema>

@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class GetDelivererProfileController {
  constructor(private getDelivererProfileUseCase: GetDelivererProfileUseCase) {}

  @ApiResponse({ status: 200, description: "Deliverer profile retrieved", type: GetDelivererProfileResponseDTO })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "Deliverer not found" })
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