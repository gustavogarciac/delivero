import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface SetOrderAsReturnedUseCaseRequest {
  orderId: string
}

type SetOrderAsReturnedUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class SetOrderAsReturnedUseCase {
  constructor(
    private ordersRepository: OrdersRepository, 
  ) {}

  async execute({
    orderId,
  } : SetOrderAsReturnedUseCaseRequest): Promise<SetOrderAsReturnedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    order.setAsReturned()

    await this.ordersRepository.save(order)

    return right({})
  }
}