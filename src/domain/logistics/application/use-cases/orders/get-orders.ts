import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order } from "../../../enterprise/entities/order"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface GetOrdersUseCaseRequest {
  page: number
  perPage: number
  query?: string
  count?: boolean
}

type GetOrdersUseCaseResponse = Either<ResourceNotFoundError, { items: Order[], total?: number }>

@Injectable()
export class GetOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    page,
    perPage,
    query,
    count
  } : GetOrdersUseCaseRequest): Promise<GetOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findMany({
      page,
      perPage,
      query,
      count
    })

    return right({ items: orders.items, total: orders.total })
  }
}