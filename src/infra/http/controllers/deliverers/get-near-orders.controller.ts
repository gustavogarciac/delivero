import { BadRequestException, Body, Controller, Get, HttpCode, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { GetNearOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-near-orders";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { ApiBearerAuth, ApiBody, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

class GetNearOrdersDto {
  @ApiProperty({
    description: "This field is the latitude of the deliverer. It is a number.",
    example: -23.563987
  })

  @ApiProperty({
    description: "This field is the longitude of the deliverer. It is a number.",
    example: -46.653252
  })
  latitude: number

  @ApiProperty({
    description: "This field is the max distance in meters. It is a number.",
    example: 1000
  })
  longitude: number

  @ApiProperty({
    description: "This field is the max distance in meters. It is a number.",
    example: 1000
  })
  maxDistance: number
  
  @ApiProperty({
    description: "This field is the deliverer id. It is an UUID.",
    example: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
  })
  delivererId: string

  static getNearOrdersSchema = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    maxDistance: z.coerce.number(),
    delivererId: z.string()
  })

  constructor(props: GetNearOrdersDto) {
    this.latitude = props.latitude
    this.longitude = props.longitude
    this.maxDistance = props.maxDistance
    this.delivererId = props.delivererId
  }
}

export type GetNearOrdersSchema = z.infer<typeof GetNearOrdersDto.getNearOrdersSchema>

@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class GetNearOrdersController {
  constructor(private getNearOrdersUseCase: GetNearOrdersUseCase) {}

  @ApiResponse({ status: 200, description: "Success" })
  @ApiBody({ type: GetNearOrdersDto })
  @Get("/near-orders")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(GetNearOrdersDto.getNearOrdersSchema))
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