import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Order } from "@/domain/logistics/enterprise/entities/order"
import { OrdersRepository } from "../../repositories/orders-repository"

interface ListOrdersUseCaseRequest {
  delivererId: string
  page: number
  perPage: number
  count?: boolean
}

type ListOrdersUseCaseResponse = Either<BadRequestError, { items: Order[], total?: number }>

export class ListOrdersUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private ordersRepository: OrdersRepository) {}

  async execute({
    delivererId,
    page,
    perPage,
    count
  } : ListOrdersUseCaseRequest): Promise<ListOrdersUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    const orders = await this.ordersRepository.findManyByDelivererId({ page, perPage, count }, delivererId)

    return right({ items: orders.items, total: orders.total })
  }
}