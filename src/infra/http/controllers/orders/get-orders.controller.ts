import { BadRequestException, Controller, Get, HttpCode, Param, Query, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { OrderPresenter } from "../../presenters/order-presenter";
import { GetOrdersUseCase } from "@/domain/logistics/application/use-cases/orders/get-orders";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

const getOrdersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  count: z.coerce.boolean().optional().default(false),
  query: z.string().optional()
})

type GetOrdersQuerySchema = z.infer<typeof getOrdersQuerySchema>

@ApiBearerAuth()
@ApiTags("Orders")
@Controller()
export class GetOrdersController {
  constructor(private getOrdersUseCase: GetOrdersUseCase) {}

  @ApiOperation({ summary: "Get orders" })
  @ApiQuery({ name: "page", description: "Page", type: Number, required: false })
  @ApiQuery({ name: "perPage", description: "Items per page", type: Number, required: false })
  @ApiQuery({ name: "count", description: "Count items", type: Boolean, required: false })
  @ApiQuery({ name: "query", description: "Search query", type: String, required: false })
  @ApiBadRequestResponse({ description: "Bad Request" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Get("/orders")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getOrdersQuerySchema))
  async handle(
    @Query() query: GetOrdersQuerySchema
  ) {
    const { count, page, perPage, query: search } = query

    const result = await this.getOrdersUseCase.execute({
      page,
      perPage,
      count,
      query: search
    })

    if(result.isLeft()) {
      const error = result.value

      if(error instanceof BadRequestError) {
        throw new BadRequestException('Invalid credentials')
      }

      throw new BadRequestException()
    }

    const { items, total } = result.value

    return { orders: items.map(OrderPresenter.toHttp), total }
  }
}