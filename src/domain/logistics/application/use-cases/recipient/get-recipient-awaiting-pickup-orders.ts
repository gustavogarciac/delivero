import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Order, OrderStatus } from "@/domain/logistics/enterprise/entities/order";
import { Injectable } from "@nestjs/common";

type GetRecipientAwaitingPickupOrdersUseCaseRequest = {
  page: number
  perPage: number
  count?: boolean
  query?: string
  recipientId: string
}

type GetRecipientAwaitingPickupOrdersUseCaseResponse = Either<BadRequestError, { items: Order[], total?: number }>

@Injectable()
export class GetRecipientAwaitingPickupOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
    count,
    query,
    recipientId
  }: GetRecipientAwaitingPickupOrdersUseCaseRequest): Promise<GetRecipientAwaitingPickupOrdersUseCaseResponse> {
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

    const awaitingPickupOrders = orders.items.filter((order) => order.status === OrderStatus.AWAITING_PICKUP)
    
    return right({ items: awaitingPickupOrders, total: awaitingPickupOrders.length })
  }
}