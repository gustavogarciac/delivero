import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { RegisterAdminUseCase } from "@/domain/logistics/application/use-cases/admin/register-admin";
import { Public } from "@/infra/auth/public";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const registerAdminSchema = z.object({
  cpf: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6).max(200),
  phone: z.string()
})

export type RegisterAdminSchema = z.infer<typeof registerAdminSchema>
@ApiTags("Admins")
@ApiBearerAuth()
@Controller()
export class RegisterAdminController {
  constructor(private registerAdminUseCase: RegisterAdminUseCase) {}

  @Post("/admins")
  @HttpCode(201)
  @ApiOperation({ summary: "Register a new admin" })
  @ApiResponse({ status: 200, description: 'Admin registered', schema: {
    example: {
      adminId: "0192da32-335d-7334-ae87-af73ed06fd60"
    }
  }})
  @ApiResponse({ status: 401, description: "Unauthorized"  })
  @ApiResponse({ status: 400, description: "Bad Request"  })
  @ApiBody({
    description: "Data needed to register a new admin",
    schema: {
      type: "object",
      properties: {
        cpf: { type: "string", example: "123.456.789-00", description: "CPF of the admin" },
        email: { type: "string", example: "admin@example.com", description: "Email of the admin" },
        name: { type: "string", example: "Admin Name", description: "Name of the admin" },
        password: { type: "string", example: "password123", minLength: 6, maxLength: 200, description: "Password for the admin" },
        phone: { type: "string", example: "+5511999999999", description: "Phone number of the admin" },
      },
      required: ["cpf", "email", "name", "password", "phone"]
    }
  })
  @Public()
  @UsePipes(new ZodValidationPipe(registerAdminSchema))
  async handle(
    @Body() body: RegisterAdminSchema
  ) {
    const { cpf, email, name, password, phone } = body

    const result = await this.registerAdminUseCase.execute({ 
      cpf,
      email,
      name,
      password,
      phone
     })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        case UnauthorizedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    const { admin } = result.value

    return { adminId: admin.id.toString() }
  }
}