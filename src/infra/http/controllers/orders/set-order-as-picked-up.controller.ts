import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SetOrderAsPickedUpUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-picked-up";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

const setOrderAsPickedUpParamSchema = z.object({
  orderId: z.string().uuid(),
  delivererId: z.string().uuid()
})

type SetOrderAsPickedUpParamSchema = z.infer<typeof setOrderAsPickedUpParamSchema>

@ApiTags('Orders')
@ApiBearerAuth()
@Controller()
export class SetOrderAsPickedUpController {
  constructor(private setOrderAsPickedUpUseCase: SetOrderAsPickedUpUseCase) {}

  @ApiOperation({ summary: 'Set order as picked up' })
  @ApiParam({ name: 'orderId', type: 'string', required: true })
  @ApiParam({ name: 'delivererId', type: 'string', required: true })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @Patch("/orders/:orderId/pick-up/:delivererId")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(setOrderAsPickedUpParamSchema))
  async handle(
    @Param() params: SetOrderAsPickedUpParamSchema
  ) {
    const { orderId, delivererId } = params

    const result = await this.setOrderAsPickedUpUseCase.execute({ delivererId, orderId })

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