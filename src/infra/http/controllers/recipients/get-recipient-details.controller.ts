import { BadRequestException, Controller, Get, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { GetRecipientDetailsUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-details";
import { RecipientPresenter } from "../../presenters/recipient-presenter";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

const getRecipientDetailsParamsSchema = z.object({
  recipientId: z.string(),
})

type GetRecipientDetailsParamsSchema = z.infer<typeof getRecipientDetailsParamsSchema>

@ApiBearerAuth()
@ApiTags('Recipients')
@Controller()
export class GetRecipientDetailsController {
  constructor(private getRecipientDetailsUseCase: GetRecipientDetailsUseCase) {}

  @ApiOperation({ summary: 'Get recipient details' })
  @ApiParam({ name: 'recipientId', description: 'Recipient ID', required: true })
  @ApiResponse({ status: 200, description: 'Recipient details', schema: {
    example: {
      recipient: {
        id: "0192da91-46b4-7999-b60e-82d7a0f2178f",
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+5511999999999",
        address: "Rua da Consolação, 1000",
        city: "São Paulo",
        state: "SP",
        zip: "01302-907",
        country: "Brazil",
        orders: [
          {
            id: "0192da91-46b4-7999-b60e-82d7a0f2178f",
            recipientId: "0192da91-46b4-7999-b60e-82d7a0f2178f",
            delivererId: "0192da91-46b4-7999-b60e-82d7a0f2178f",
            status: "DELIVERED",
            deliveryAddress: "Rua da Consolação, 1000",
            geo: {
              latitude: -23.5505199,
              longitude: -46.6333094,
            },
            trackingCode: "321321342",
            notes: "Do not bend",
            pickedAt: "",
            deliveredAt: "2021-09-01T00:00:00Z",
            updatedAt: "2021-09-01T00:00:00Z",
            returnedAt: "2021-09-01T00:00:00Z",
          }
        ],
        lastOrderAt: "2021-09-01T00:00:00Z",
        createdAt: "2021-09-01T00:00:00Z",
        updatedAt: "2021-09-01T00:00:00Z",
      }
    }
  }})
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get("/recipients/:recipientId")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(new ZodValidationPipe(getRecipientDetailsParamsSchema)) params: GetRecipientDetailsParamsSchema,
  ) {
    const { recipientId } = params

    const userId = user.sub

    if(recipientId !== userId) {
      throw new UnauthorizedException("You are not allowed to access this resource")
    }

    const result = await this.getRecipientDetailsUseCase.execute({ recipientId })

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

    return { recipient: RecipientPresenter.toHttp(recipient) }
  }
}