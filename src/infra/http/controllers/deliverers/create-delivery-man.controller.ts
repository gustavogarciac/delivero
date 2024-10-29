import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { CreateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/create-delivery-man";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateDelivererRequestDTO, CreateDelivererResponseDTO } from "./docs/create-delivery-man.controller.docs";

const createDelivererSchema = z.object({
  cpf: z.string(),
  name: z.string(),
  password: z.string(),
  email: z.string(),
  phone: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

export type CreateDelivererSchema = z.infer<typeof createDelivererSchema>

@ApiTags('Deliverers')
@Controller()
export class CreateDelivererController {
  constructor(private createDelivererUseCase: CreateDelivererUseCase) {}

  @ApiResponse({ status: 201, description: "Success", type: CreateDelivererResponseDTO })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiBody({ type: CreateDelivererRequestDTO })
  @Post("/deliverers")
  @HttpCode(201)
  @Public()
  @UsePipes(new ZodValidationPipe(createDelivererSchema))
  async handle(
    @Body() body: CreateDelivererSchema
  ) {
    const { 
      cpf,
      name,
      password,
      email,
      latitude,
      longitude,
      phone
     } = body

    const result = await this.createDelivererUseCase.execute({
      cpf,
      name,
      password,
      email,
      latitude,
      longitude,
      phone,
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

    const { deliverer } = result.value

    return { delivererId: deliverer.id.toString() }
  }
}