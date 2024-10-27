import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { RegisterRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/register-recipient";
import { Public } from "@/infra/auth/public";

const registerRecipientSchema = z.object({
  address: z.string(),
  city: z.string(),
  country: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6).max(200),
  phone: z.string(),
  state: z.string(),
  zip: z.string()
})

type RegisterRecipientSchema = z.infer<typeof registerRecipientSchema>

@Controller()
export class RegisterRecipientController {
  constructor(private registerRecipientUseCase: RegisterRecipientUseCase) {}

  @Post("/recipients")
  @HttpCode(201)
  @Public()
  async handle(
    @Body(new ZodValidationPipe(registerRecipientSchema)) body: RegisterRecipientSchema,
  ) {
    const {
      address,
      city,
      country,
      email,
      name,
      password,
      phone,
      state,
      zip
    } = body

    const result = await this.registerRecipientUseCase.execute({
      address,
      city,
      country,
      email,
      name,
      password,
      phone,
      state,
      zip
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

    const { recipient } = result.value

    return { recipientId: recipient.id.toString() }
  }
}