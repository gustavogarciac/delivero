import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order } from "../../../enterprise/entities/order"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface GetOrderDetailsRequest {
  orderId: string
}

type GetOrderDetailsResponse = Either<ResourceNotFoundError, { order: Order }>

@Injectable()
export class GetOrderDetailsUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId
  } : GetOrderDetailsRequest): Promise<GetOrderDetailsResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    return right({ order })
  }
}