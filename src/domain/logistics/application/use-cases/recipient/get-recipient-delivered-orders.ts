import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Order, OrderStatus } from "@/domain/logistics/enterprise/entities/order";

type GetRecipientDeliveredOrdersUseCaseRequest = {
  page: number
  perPage: number
  count?: boolean
  query?: string
  recipientId: string
}

type GetRecipientDeliveredOrdersUseCaseResponse = Either<BadRequestError, { items: Order[], total?: number }>

export class GetRecipientDeliveredOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
    count,
    query,
    recipientId
  }: GetRecipientDeliveredOrdersUseCaseRequest): Promise<GetRecipientDeliveredOrdersUseCaseResponse> {
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

    const deliveredOrders = orders.items.filter((order) => order.status === OrderStatus.DELIVERED)
    
    return right({ items: deliveredOrders, total: deliveredOrders.length })
  }
}