import { BadRequestException, Controller, Get, HttpCode, Query, UnauthorizedException } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { z } from "zod";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RecipientPresenter } from "../../presenters/recipient-presenter";
import { GetRecipientsUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipients";

const getRecipientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
  count: z.coerce.boolean().default(false),
  search: z.string().optional()
})

type GetRecipientsQuerySchema = z.infer<typeof getRecipientsQuerySchema>

@Controller()
export class GetRecipientsController {
  constructor(private getRecipientsUseCase: GetRecipientsUseCase) {}

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