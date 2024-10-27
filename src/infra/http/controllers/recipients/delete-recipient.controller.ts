import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { DeleteRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/delete-recipient";

const deleteRecipientParamsSchema = z.object({
  recipientId: z.string(),
})

type DeleteRecipientParamsSchema = z.infer<typeof deleteRecipientParamsSchema>

@Controller()
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete("/recipients/:recipientId")
  @HttpCode(204)
  @Public()
  async handle(
    @Param(new ZodValidationPipe(deleteRecipientParamsSchema)) params: DeleteRecipientParamsSchema
  ) {
    const { recipientId } = params

    const result = await this.deleteRecipientUseCase.execute({ recipientId })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    return {}
  }
}