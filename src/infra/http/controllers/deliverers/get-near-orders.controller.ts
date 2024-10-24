import { BadRequestException, Body, Controller, Get, HttpCode, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { GetNearOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-near-orders";
import { BadRequestError } from "@/core/errors/bad-request-error";

const getNearOrdersSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  maxDistance: z.coerce.number(),
  delivererId: z.string()
})

type GetNearOrdersSchema = z.infer<typeof getNearOrdersSchema>

@Controller()
export class GetNearOrdersController {
  constructor(private getNearOrdersUseCase: GetNearOrdersUseCase) {}

  @Get("/near-orders")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getNearOrdersSchema))
  async handle(
    @Body() params: GetNearOrdersSchema
  ) {
    const { latitude, longitude, maxDistance, delivererId } = params

    const result = await this.getNearOrdersUseCase.execute({ 
      delivererId, 
      latitude, 
      longitude, 
      maxDistance
  })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    const { orders } = result.value

    return { orders }
  }
}