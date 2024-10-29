import { BadRequestException, Controller, Delete, HttpCode, NotFoundException, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { DeleteDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/delete-delivery-man";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const deleteDelivererSchema = z.object({
  delivererId: z.string()
})

export type DeleteDelivererSchema = z.infer<typeof deleteDelivererSchema>

@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class DeleteDelivererController {
  constructor(private deleteDelivererUseCase: DeleteDelivererUseCase) {}

  @ApiOperation({ summary: "Delete a deliverer" })
  @ApiResponse({ status: 204, description: "Deliverer deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiParam({ name: "delivererId", type: String, required: true, example: "0192da91-46b4-7999-b60e-82d7a0f2178f" })
  @ApiBadRequestResponse({ description: "Deliverer not found" })
  @ApiNotFoundResponse({ description: "Deliverer not found" })
  @Delete("/deliverers/:delivererId")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(deleteDelivererSchema))
  async handle(
    @Param() params: DeleteDelivererSchema
  ) {
    const { delivererId } = params

    const result = await this.deleteDelivererUseCase.execute({ delivererId })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    return {}
  }
}