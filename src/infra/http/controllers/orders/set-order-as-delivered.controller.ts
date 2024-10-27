import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { SetOrderAsDeliveredUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-delivered";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

const setOrderAsDeliveredParamSchema = z.object({
  orderId: z.string().uuid(),
  delivererId: z.string().uuid()
})

type SetOrderAsDeliveredParamSchema = z.infer<typeof setOrderAsDeliveredParamSchema>

@Controller()
export class SetOrderAsDeliveredController {
  constructor(private setOrderAsDeliveredUseCase: SetOrderAsDeliveredUseCase) {}

  @Patch("/orders/:orderId/delivered/:delivererId")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(setOrderAsDeliveredParamSchema))
  async handle(
    @Param() params: SetOrderAsDeliveredParamSchema
  ) {
    const { orderId, delivererId } = params

    const result = await this.setOrderAsDeliveredUseCase.execute({ delivererId, orderId })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    return {}
  }
}