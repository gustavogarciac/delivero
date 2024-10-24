import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { GetDelivererProfileUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-delivery-man-profile";

const getDelivererProfileSchema = z.object({
  delivererId: z.string()
})

type GetDelivererProfileSchema = z.infer<typeof getDelivererProfileSchema>

@Controller()
export class GetDelivererProfileController {
  constructor(private getDelivererProfileUseCase: GetDelivererProfileUseCase) {}

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

    const deliverer = result.value

    return deliverer
  }
}