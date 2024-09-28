import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order } from "../../../enterprise/entities/order"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface CreateOrderUseCaseRequest {
  orderId: string
}

type CreateOrderUseCaseResponse = Either<ResourceNotFoundError, { order: Order }>

export class CreateOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId
  } : CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    return right({ order })
  }
}