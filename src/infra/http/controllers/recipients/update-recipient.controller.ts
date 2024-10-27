import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { UpdateRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/update-recipient";

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

@Controller()
export class UpdateRecipientController {
  constructor(private updateRecipientUseCase: UpdateRecipientUseCase) {}

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