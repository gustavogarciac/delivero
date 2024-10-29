import { BadRequestException, Controller, Delete, HttpCode, NotFoundException, Param, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { DeleteDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/delete-delivery-man";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteDelivererRequestDTO } from "./docs/delete-deliverer.controller.docs";

const deleteDelivererSchema = z.object({
  delivererId: z.string()
})

export type DeleteDelivererSchema = z.infer<typeof deleteDelivererSchema>

@ApiTags("Deliverers")
@ApiBearerAuth()
@Controller()
export class DeleteDelivererController {
  constructor(private deleteDelivererUseCase: DeleteDelivererUseCase) {}

  @ApiResponse({ status: 204, description: "Deliverer deleted successfully" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiParam({ type: DeleteDelivererRequestDTO, name: "delivererId" })
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