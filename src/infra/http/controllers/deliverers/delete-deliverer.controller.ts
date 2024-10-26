import { BadRequestException, Controller, Delete, HttpCode, NotFoundException, Param, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { DeleteDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/delete-delivery-man";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const deleteDelivererSchema = z.object({
  delivererId: z.string()
})

type DeleteDelivererSchema = z.infer<typeof deleteDelivererSchema>

@Controller()
export class DeleteDelivererController {
  constructor(private deleteDelivererUseCase: DeleteDelivererUseCase) {}

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