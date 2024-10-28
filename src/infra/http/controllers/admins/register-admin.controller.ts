import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { RegisterAdminUseCase } from "@/domain/logistics/application/use-cases/admin/register-admin";
import { Public } from "@/infra/auth/public";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {  RegisterAdminRequestDTO, RegisterAdminResponseDTO } from "./documentation/register-admin.controller.docs";

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
  @ApiResponse({ status: 201, description: "Admin created", type: RegisterAdminResponseDTO })
  @ApiResponse({ status: 401, description: "Unauthorized"  })
  @ApiResponse({ status: 400, description: "Bad Request"  })
  @ApiBody({ type: RegisterAdminRequestDTO })
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