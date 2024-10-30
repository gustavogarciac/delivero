import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Public } from "@/infra/auth/public";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { DeleteRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/delete-recipient";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const deleteRecipientParamsSchema = z.object({
  recipientId: z.string(),
})

type DeleteRecipientParamsSchema = z.infer<typeof deleteRecipientParamsSchema>

@ApiBearerAuth()
@ApiTags('Recipients')
@Controller()
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @ApiOperation({ summary: 'Delete recipient' })
  @ApiParam({ name: 'recipientId', description: 'Recipient ID', required: true })
  @ApiResponse({ status: 204, description: 'Recipient deleted' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
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