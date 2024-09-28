import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Order, OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { OrdersRepository } from "../../repositories/orders-repository"

interface ListPendingOrdersUseCaseRequest {
  delivererId: string
}

type ListPendingOrdersUseCaseResponse = Either<BadRequestError, { orders: Order[] }>

export class ListPendingOrdersUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private ordersRepository: OrdersRepository) {}

  async execute({
    delivererId,
  } : ListPendingOrdersUseCaseRequest): Promise<ListPendingOrdersUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    const orders = await this.ordersRepository.findManyByDelivererId(delivererId)

    const pendingOrders = orders.filter((order) => order.status === OrderStatus.IN_TRANSIT)

    return right({ orders: pendingOrders })
  }
}