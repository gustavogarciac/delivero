import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { UpdateRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/update-recipient";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const updateRecipientSchema = z.object({
  address: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  city: z.string(),
  country: z.string(),
  state: z.string(),
  zip: z.string()
})

const updateRecipientParamSchema = z.object({
  recipientId: z.string().uuid()
})

type UpdateRecipientSchema = z.infer<typeof updateRecipientSchema>
type UpdateRecipientParamSchema = z.infer<typeof updateRecipientParamSchema>

const updateRecipientParamSchemaValidaiton = new ZodValidationPipe(updateRecipientParamSchema)

@ApiTags("Recipients")
@ApiBearerAuth()
@Controller()
export class UpdateRecipientController {
  constructor(private updateRecipientUseCase: UpdateRecipientUseCase) {}

  @ApiOperation({ summary: "Update recipient" })
  @ApiBody({ description: "Update recipient", schema: {
    example: {
      address: "Rua da Consolação, 1000",
      city: "São Paulo",
      country: "Brazil",
      email: "johndoe@example.com",
      name: "John Doe",
      phone: "+5511987654321",

    }
  }})
  @ApiParam({ name: "recipientId", type: String, required: true })
  @ApiResponse({ status: 204, description: "Recipient successfully updated" })
  @Put("/recipients/:recipientId")
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(updateRecipientSchema)) body: UpdateRecipientSchema,
    @Param(updateRecipientParamSchemaValidaiton) params: UpdateRecipientParamSchema
  ) {
    const { email, name, phone, address, city, country, state, zip } = body
    const { recipientId } = params

    const result = await this.updateRecipientUseCase.execute({
      address,
      city,
      country,
      email,
      name,
      phone,
      recipientId,
      state,
      zip
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