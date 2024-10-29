import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { UpdateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/update-deliverer";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const updateDelivererSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  phone: z.string()
})

const updateDelivererParamSchema = z.object({
  delivererId: z.string().uuid()
})

type UpdateDelivererSchema = z.infer<typeof updateDelivererSchema>
type UpdateDelivererParamSchema = z.infer<typeof updateDelivererParamSchema>

const updateDelivererParamSchemaValidaiton = new ZodValidationPipe(updateDelivererParamSchema)

@Controller()
@ApiTags("Deliverers")
@ApiBearerAuth()
export class UpdateDelivererController {
  constructor(private updateDelivererUseCase: UpdateDelivererUseCase) {}

  @ApiOperation({ summary: "Update deliverer" })
  @ApiBody({ description: "Update deliverer", schema: {
    example: {
      email: "johndoe@example.com",
      name: "John Doe",
      password: "password",
      phone: "1234567890"
    }
  }})
  @ApiResponse({ status: 204, description: "Deliverer updated" })
  @ApiBadRequestResponse({ description: "Bad Request" })
  @ApiParam({ name: "delivererId", description: "Deliverer ID", type: String, required: true })
  @Put("/deliverers/:delivererId")
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(updateDelivererSchema)) body: UpdateDelivererSchema,
    @Param(updateDelivererParamSchemaValidaiton) params: UpdateDelivererParamSchema
  ) {
    const { email, name, password, phone } = body
    const { delivererId } = params

    const result = await this.updateDelivererUseCase.execute({
      delivererId,
      email,
      name,
      password,
      phone,
    })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException("An unexpected error occurred")
      }
    }

    return {}
  }
}