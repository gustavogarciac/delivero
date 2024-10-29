import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SetOrderAsReturnedUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-returned";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const setOrderAsReturnedParamSchema = z.object({
  orderId: z.string().uuid(),
})

type SetOrderAsReturnedParamSchema = z.infer<typeof setOrderAsReturnedParamSchema>

@ApiTags('Orders')
@ApiBearerAuth()
@Controller()
export class SetOrderAsReturnedController {
  constructor(private setOrderAsReturnedUseCase: SetOrderAsReturnedUseCase) {}

  @ApiOperation({ summary: 'Set order as returned' })
  @ApiParam({ name: 'orderId', type: 'string', required: true })
  @ApiResponse({ status: 204, description: 'Order returned' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Order not found' })
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