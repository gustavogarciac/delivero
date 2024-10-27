import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface SetOrderAsAvailableToPickUpUseCaseRequest {
  orderId: string
}

type SetOrderAsAvailableToPickUpUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class SetOrderAsAvailableToPickUpUseCase {
  constructor(
    private ordersRepository: OrdersRepository, 
  ) {}

  async execute({
    orderId,
  } : SetOrderAsAvailableToPickUpUseCaseRequest): Promise<SetOrderAsAvailableToPickUpUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    order.setAsAwaitingPickup()

    await this.ordersRepository.save(order)

    return right({})
  }
}