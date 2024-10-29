import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { FetchDeliverersUseCase } from "@/domain/logistics/application/use-cases/deliverer/fetch-delivery-men";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { DelivererPresenter } from "../../presenters/deliverer-presenter";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

const paginationQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  per_page: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(1)),
  count: z.coerce.boolean().optional().default(false),
  query: z.string().optional(),
})

export type PaginationQueryParamSchema = z.infer<typeof paginationQueryParamSchema>

const paginationQueryValidationPipe = new ZodValidationPipe(
  paginationQueryParamSchema,
)
@ApiTags('Deliverers')
@ApiBearerAuth()
@Controller()
export class FetchDeliverersController {
  constructor(private fetchDelivererUseCase: FetchDeliverersUseCase) {}

  @ApiOperation({ summary: 'Fetch deliverers' })
  @ApiResponse({ status: 200, description: 'Deliverers were fetched successfully', schema: {
    example: {
      deliverers: [
        {
          id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
          name: 'John Doe',
          email: "johndoe@example.com",
          phone: "1234567890",
          rating: 4.5,
          deliveriesCount: 73,
          latitude: -23.5505199,
          longitude: -46.6333094,
          isAvailable: true,
          status: "ACTIVE",
          role: "DELIVERER",
          vehicle: "CHEVROLET ONIX",
          orders: [
            {
              id: '0192da91-46b4-7999-b60e-82d7a0f2178f',
              recipientId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
              delivererId: '0192da91-46b4-7999-b60e-82d7a0f2178f',
              status: 'DELIVERED',
              deliveryAddress: 'Rua da Consolação, 1000',
              geo: {
                latitude: -23.5505199,
                longitude: -46.6333094,
              },
              trackingCode: "321321342",
              notes: 'Do not bend',
              pickedAt: "",
              deliveredAt: '2021-09-01T00:00:00Z',
              updatedAt: '2021-09-01T00:00:00Z',
              returnedAt: '2021-09-01T00:00:00Z',
            }
          ],
          registeredAt: "2021-09-01T00:00:00Z",
          updatedAt: "2021-09-01T00:00:00Z",
        }
      ]
    }
  } })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'count', required: false, type: Boolean, example: false })
  @ApiQuery({ name: 'query', required: false, type: String, example: 'John Doe' })
  @Get("/deliverers")
  @HttpCode(200)
  async handle(
    @Query(paginationQueryValidationPipe) paginationParams: PaginationQueryParamSchema 
  ) {
    const { page, per_page: perPage, count, query } = paginationParams

    const result = await this.fetchDelivererUseCase.execute({ page, perPage, count, query })

    const deliverers = result.value

    return { deliverers: deliverers?.items.map(DelivererPresenter.toHttp), total: deliverers?.total }
  }
}