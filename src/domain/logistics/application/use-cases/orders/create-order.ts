import { Either, right } from "@/core/either"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order, OrderStatus } from "../../../enterprise/entities/order"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Geolocalization } from "../../../enterprise/entities/value-objects/geolocalization"
import { Injectable } from "@nestjs/common"

interface CreateOrderUseCaseRequest {
  delivererId?: string,
  recipientId: string,
  adminId?: string,
  deliveryAddress: string,
  geo: Geolocalization,
  notes?: string | null,
}

type CreateOrderUseCaseResponse = Either<BadRequestError, { order: Order }>

@Injectable()
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
      delivererId: delivererId ? new UniqueEntityId(delivererId) : null,
      recipientId: new UniqueEntityId(recipientId),
      adminId: new UniqueEntityId(adminId),
      status: OrderStatus.PREPARING,
      deliveryAddress,
      geo,
      notes
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}