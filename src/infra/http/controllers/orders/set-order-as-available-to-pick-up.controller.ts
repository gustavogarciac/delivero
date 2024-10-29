import { BadRequestException, Controller, Get, HttpCode, Param, Patch, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { SetOrderAsAvailableToPickUpUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-available-to-pick-up";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const setOrderAsAvailableToPickUpParamSchema = z.object({
  orderId: z.string()
})

type SetOrderAsAvailableToPickUpParamSchema = z.infer<typeof setOrderAsAvailableToPickUpParamSchema>

@ApiTags('Orders')
@ApiBearerAuth()
@Controller()
export class SetOrderAsAvailableToPickUpController {
  constructor(private setOrderAsAvailableToPickUpUseCase: SetOrderAsAvailableToPickUpUseCase) {}

  @ApiOperation({ summary: 'Set order as available to pick up' })
  @ApiParam({ name: 'orderId', type: 'string', required: true })
  @ApiResponse({ status: 204, description: 'Order set as available to pick up' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
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