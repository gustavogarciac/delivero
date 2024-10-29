import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { FetchDeliverersUseCase } from "@/domain/logistics/application/use-cases/deliverer/fetch-delivery-men";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { DelivererPresenter } from "../../presenters/deliverer-presenter";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FetchDelivererResponseDTO } from "./docs/fetch-deliverer.controller.docs";

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

  @ApiResponse({ status: 200, description: 'Deliverers were fetched successfully', type: FetchDelivererResponseDTO })
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