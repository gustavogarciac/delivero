import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { RegisterRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/register-recipient";
import { Public } from "@/infra/auth/public";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

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

@ApiTags("Recipients")
@ApiBearerAuth()
@Controller()
export class RegisterRecipientController {
  constructor(private registerRecipientUseCase: RegisterRecipientUseCase) {}

  @ApiOperation({ summary: "Register recipient" })
  @ApiBody({ description: "Register recipient", schema: {
    example: {
      address: "Rua da Consolação, 1000",
      city: "São Paulo",
      country: "Brazil",
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
      phone: "+5511987654321",
      state: "SP",
      zip: "01302-000"
    }
  }})
  @ApiResponse({ status: 201, description: "Recipient successfully registered", schema: {
    example: {
      recipientId: "0192da91-46b4-7999-b60e-82d7a0f2178f"
    }
  }})
  @ApiBadRequestResponse({ description: "Bad request" })
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