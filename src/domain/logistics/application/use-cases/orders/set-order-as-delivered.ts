import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { BadRequestError } from "@/core/errors/bad-request-error"

interface SetOrderAsDeliveredUseCaseRequest {
  orderId: string
  delivererId: string
}

type SetOrderAsDeliveredUseCaseResponse = Either<ResourceNotFoundError | BadRequestError, object>

export class SetOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository, 
    private deliverersRepository: DeliverersRepository
  ) {}

  async execute({
    orderId,
    delivererId,
  } : SetOrderAsDeliveredUseCaseRequest): Promise<SetOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    if(order.status !== OrderStatus.IN_TRANSIT)
      return left(new BadRequestError("You can only set an order as delivered if it is in transit"))
    
    await this.ordersRepository.setAsDelivered(orderId, delivererId)
    await this.deliverersRepository.incrementDeliveriesCount(delivererId)

    return right({})
  }
}