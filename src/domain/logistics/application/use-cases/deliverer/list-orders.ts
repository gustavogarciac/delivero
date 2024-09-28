import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Order } from "@/domain/logistics/enterprise/entities/order"
import { OrdersRepository } from "../../repositories/orders-repository"

interface ListOrdersUseCaseRequest {
  delivererId: string
}

type ListOrdersUseCaseResponse = Either<BadRequestError, { orders: Order[] }>

export class ListOrdersUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private ordersRepository: OrdersRepository) {}

  async execute({
    delivererId,
  } : ListOrdersUseCaseRequest): Promise<ListOrdersUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    const orders = await this.ordersRepository.findManyByDelivererId(delivererId)

    return right({ orders: orders })
  }
}