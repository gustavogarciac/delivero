import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { ConfirmDelivererPasswordResetUseCase } from "@/domain/logistics/application/use-cases/deliverer/confirm-deliverer-password-reset";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const confirmDelivererPasswordResetSchema = z.object({
  delivererId: z.string(),
  newPassword: z.string().min(6),
  token: z.string()
})

export type ConfirmDelivererPasswordResetSchema = z.infer<typeof confirmDelivererPasswordResetSchema>

@ApiTags('Deliverers')
@Controller()
export class ConfirmDelivererPasswordResetController {
  constructor(private confirmDelivererPasswordResetUseCase: ConfirmDelivererPasswordResetUseCase) {}

  @Post("/sessions/deliverers/confirm-password-reset")
  @HttpCode(204)
  @Public()
  @ApiOperation({ summary: "Confirm deliverer password reset" })
  @ApiBody({ description: "Data needed to confirm deliverer password reset", schema: {
    type: "object",
    properties: {
      delivererId: { type: "string", example: "0192da32-335d-7334-ae87-af73ed06fd60", description: "Deliverer ID" },
      newPassword: { type: "string", example: "password123", minLength: 6, description: "New password" },
      token: { type: "string", example: "token", description: "Token received in the email" }
    },
    required: ["delivererId", "newPassword", "token"]
  }})
  @ApiResponse({ status: 204, description: "Success" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UsePipes(new ZodValidationPipe(confirmDelivererPasswordResetSchema))
  async handle(
    @Body() body: ConfirmDelivererPasswordResetSchema
  ) {
    const { delivererId, newPassword, token } = body

    const result = await this.confirmDelivererPasswordResetUseCase.execute({ delivererId, newPassword, token })

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

    return {}
  }
}