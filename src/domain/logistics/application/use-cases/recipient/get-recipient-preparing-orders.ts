import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Order, OrderStatus } from "@/domain/logistics/enterprise/entities/order";

type GetRecipientPreparingOrdersUseCaseRequest = {
  page: number
  perPage: number
  count?: boolean
  query?: string
  recipientId: string
}

type GetRecipientPreparingOrdersUseCaseResponse = Either<BadRequestError, { items: Order[], total?: number }>

export class GetRecipientPreparingOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
    count,
    query,
    recipientId
  }: GetRecipientPreparingOrdersUseCaseRequest): Promise<GetRecipientPreparingOrdersUseCaseResponse> {
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

    const returnedOrders = orders.items.filter((order) => order.status === OrderStatus.PREPARING)
    
    return right({ items: returnedOrders, total: returnedOrders.length })
  }
}