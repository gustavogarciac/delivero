import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Injectable } from "@nestjs/common"

interface SetOrderAsPickedUpUseCaseRequest {
  orderId: string
  delivererId: string
}

type SetOrderAsPickedUpUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class SetOrderAsPickedUpUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverersRepository: DeliverersRepository
  ) {}

  async execute({
    orderId,
    delivererId,
  } : SetOrderAsPickedUpUseCaseRequest): Promise<SetOrderAsPickedUpUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())


    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new ResourceNotFoundError())
    
    deliverer.attendOrder(order)
    order.setAsPickedUp(delivererId)

    await this.ordersRepository.save(order)
    await this.deliverersRepository.save(deliverer)

    return right({})
  }
}