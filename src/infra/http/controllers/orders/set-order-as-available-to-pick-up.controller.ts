import { BadRequestException, Controller, Get, HttpCode, Param, Patch, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { SetOrderAsAvailableToPickUpUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-available-to-pick-up";

const setOrderAsAvailableToPickUpParamSchema = z.object({
  orderId: z.string()
})

type SetOrderAsAvailableToPickUpParamSchema = z.infer<typeof setOrderAsAvailableToPickUpParamSchema>

@Controller()
export class SetOrderAsAvailableToPickUpController {
  constructor(private setOrderAsAvailableToPickUpUseCase: SetOrderAsAvailableToPickUpUseCase) {}

  @Patch("/orders/:orderId/available-to-pick-up")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(setOrderAsAvailableToPickUpParamSchema))
  async handle(
    @Param() params: SetOrderAsAvailableToPickUpParamSchema
  ) {
    const { orderId } = params

    const result = await this.setOrderAsAvailableToPickUpUseCase.execute({ orderId })

    if(result.isLeft()) {
      const error = result.value

      if(error instanceof BadRequestError) {
        throw new BadRequestException('Invalid credentials')
      }

      throw new BadRequestException()
    }

    return {}
  }
}