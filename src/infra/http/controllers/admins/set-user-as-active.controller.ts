import { BadRequestException, Body, Controller, HttpCode, Param, Patch, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { SetUserAsActiveUseCase } from "@/domain/logistics/application/use-cases/admin/set-user-as-active";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SetUserAsActiveDTO } from "./documentation/set-user-as-active.controller.docs";

const setUserAsActiveParamSchema = z.object({
  delivererId: z.string()
})

export type SetUserAsActiveParamSchema = z.infer<typeof setUserAsActiveParamSchema>

@ApiTags('Admins')
@ApiBearerAuth()
@Controller()
export class SetUserAsActiveController {
  constructor(private setUserAsActiveUseCase: SetUserAsActiveUseCase) {}

  @Patch("/admins/set-user-as-active/:delivererId")
  @HttpCode(204)
  @ApiOperation({ summary: "Set user as active" })
  @ApiResponse({ status: 201, description: "User set as active", type: SetUserAsActiveDTO })
  @ApiResponse({ status: 401, description: "Unauthorized"  })
  @ApiResponse({ status: 400, description: "Bad Request"  })
  @ApiParam({ name: "delivererId", type: "string" })
  async handle(
    @CurrentUser() admin: UserPayload,
    @Param(new ZodValidationPipe(setUserAsActiveParamSchema)) params: SetUserAsActiveParamSchema
  ) {
    const { delivererId } = params

    const adminId = admin.sub

    const result = await this.setUserAsActiveUseCase.execute({ 
      adminId,
      delivererId
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

    return {}
  }
}