import { BadRequestException, Controller, Get, HttpCode, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { GetOrderDetailsUseCase } from "@/domain/logistics/application/use-cases/orders/get-order-details";
import { OrderPresenter } from "../../presenters/order-presenter";

const getOrderDetailsParamSchema = z.object({
  orderId: z.string().uuid()
})

type GetOrderDetailsParamSchema = z.infer<typeof getOrderDetailsParamSchema>

@Controller()
export class GetOrderDetailsController {
  constructor(private getOrderDetailsUseCase: GetOrderDetailsUseCase) {}

  @Get("/orders/:orderId")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getOrderDetailsParamSchema))
  async handle(
    @Param() params: GetOrderDetailsParamSchema
  ) {
    const { orderId } = params

    const result = await this.getOrderDetailsUseCase.execute({ orderId })

    if(result.isLeft()) {
      const error = result.value

      if(error instanceof BadRequestError) {
        throw new BadRequestException('Invalid credentials')
      }

      throw new BadRequestException()
    }

    const { order } = result.value

    return { order: OrderPresenter.toHttp(order)}
  }
}