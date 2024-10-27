import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SetOrderAsReturnedUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-returned";

const setOrderAsReturnedParamSchema = z.object({
  orderId: z.string().uuid(),
})

type SetOrderAsReturnedParamSchema = z.infer<typeof setOrderAsReturnedParamSchema>

@Controller()
export class SetOrderAsReturnedController {
  constructor(private setOrderAsReturnedUseCase: SetOrderAsReturnedUseCase) {}

  @Patch("/orders/:orderId/return")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(setOrderAsReturnedParamSchema))
  async handle(
    @Param() params: SetOrderAsReturnedParamSchema
  ) {
    const { orderId } = params

    const result = await this.setOrderAsReturnedUseCase.execute({ orderId })

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