import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { FetchDeliverersUseCase } from "@/domain/logistics/application/use-cases/deliverer/fetch-delivery-men";
import { PaginationParams } from "@/core/repositories/pagination";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { DelivererPresenter } from "../../presenters/deliverer-presenter";

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

type PaginationQueryParamSchema = z.infer<typeof paginationQueryParamSchema>

const paginationQueryValidationPipe = new ZodValidationPipe(
  paginationQueryParamSchema,
)


@Controller()
export class FetchDeliverersController {
  constructor(private fetchDelivererUseCase: FetchDeliverersUseCase) {}

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