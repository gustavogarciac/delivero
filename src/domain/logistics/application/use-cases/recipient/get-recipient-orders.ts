import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { PaginationParams } from "@/core/repositories/pagination";
import { Order } from "@/domain/logistics/enterprise/entities/order";

type GetRecipientOrdersUseCaseRequest = {
  page: number
  perPage: number
  count?: boolean
  query?: string
  recipientId: string
}

type GetRecipientOrdersUseCaseResponse = Either<BadRequestError, { items: Order[], total?: number }>

export class GetRecipientOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
    count,
    query,
    recipientId
  }: GetRecipientOrdersUseCaseRequest): Promise<GetRecipientOrdersUseCaseResponse> {
    const paginationParams = {
      page,
      perPage,
      count,
      query
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if(!recipient) {
      return left(new BadRequestError("Recipient not found"))
    }

    const recipients = await this.recipientsRepository.fetchOrders(paginationParams, recipientId)
    
    return right({ items: recipients.items, total: recipients.total })
  }
}