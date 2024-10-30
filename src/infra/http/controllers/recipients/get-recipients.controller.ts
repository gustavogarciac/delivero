import { BadRequestException, Controller, Get, HttpCode, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RecipientPresenter } from "../../presenters/recipient-presenter";
import { GetRecipientsUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipients";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

const getRecipientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
  count: z.coerce.boolean().default(false),
  search: z.string().optional()
})

type GetRecipientsQuerySchema = z.infer<typeof getRecipientsQuerySchema>

@ApiTags("Recipients")
@ApiBearerAuth()
@Controller()
export class GetRecipientsController {
  constructor(private getRecipientsUseCase: GetRecipientsUseCase) {}

  @ApiOperation({ summary: "Get recipients" })
  @ApiQuery({ name: "page", type: Number, required: false })
  @ApiQuery({ name: "perPage", type: Number, required: false })
  @ApiQuery({ name: "count", type: Boolean, required: false })
  @ApiQuery({ name: "search", type: String, required: false })
  @ApiResponse({ status: 200, description: "Recipients successfully fetched", schema: {
    example: {
      recipients: [
        {
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
      ],
      total: 1
    }
  }})
  @ApiBadRequestResponse({ description: "Bad request" })
  @Get("/recipients")
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(getRecipientsQuerySchema)) query: GetRecipientsQuerySchema,
  ) {
    const { count, page, perPage, search } = query

    const result = await this.getRecipientsUseCase.execute({ page, perPage, count, query: search })

    if(result.isLeft()) {
      const error = result.value

      switch(error.constructor) {
        case BadRequestError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      } 
    }

    const { items, total } = result.value

    return { recipients: items.map(RecipientPresenter.toHttp), total }
  }
}