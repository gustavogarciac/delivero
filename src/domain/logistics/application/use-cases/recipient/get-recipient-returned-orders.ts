import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { PaginationParams } from "@/core/repositories/pagination";
import { Order, OrderStatus } from "@/domain/logistics/enterprise/entities/order";

type GetRecipientReturnedOrdersUseCaseRequest = {
  page: number
  perPage: number
  count?: boolean
  query?: string
  recipientId: string
}

type GetRecipientReturnedOrdersUseCaseResponse = Either<BadRequestError, { items: Order[], total?: number }>

export class GetRecipientReturnedOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
    count,
    query,
    recipientId
  }: GetRecipientReturnedOrdersUseCaseRequest): Promise<GetRecipientReturnedOrdersUseCaseResponse> {
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

    const orders = await this.recipientsRepository.fetchOrders(paginationParams, recipientId)

    const returnedOrders = orders.items.filter((order) => order.status === OrderStatus.RETURNED)
    
    return right({ items: returnedOrders, total: returnedOrders.length })
  }
}