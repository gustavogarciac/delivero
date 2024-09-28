import { Either, right } from "@/core/either"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order, OrderStatus } from "../../../enterprise/entities/order"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Geolocalization } from "../../../enterprise/entities/value-objects/geolocalization"

interface CreateOrderUseCaseRequest {
  delivererId: UniqueEntityId,
  recipientId: UniqueEntityId,
  adminId?: UniqueEntityId | null,
  deliveryAddress: string,
  geo: Geolocalization,
  notes?: string | null,
}

type CreateOrderUseCaseResponse = Either<BadRequestError, { order: Order }>

export class CreateOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    delivererId,
    recipientId,
    adminId,
    deliveryAddress,
    geo,
    notes
  } : CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      delivererId,
      recipientId,
      adminId,
      status: OrderStatus.PREPARING,
      deliveryAddress,
      geo,
      notes
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}