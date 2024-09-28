import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order } from "../../../enterprise/entities/order"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { AdminsRepository } from "../../repositories/admins-repository"

interface SetOrderAsPickedUpUseCaseRequest {
  orderId: string
  adminId: string
}

type SetOrderAsPickedUpUseCaseResponse = Either<ResourceNotFoundError, object>

export class SetOrderAsPickedUpUseCase {
  constructor(private ordersRepository: OrdersRepository, private adminsRepository: AdminsRepository) {}

  async execute({
    orderId,
    adminId
  } : SetOrderAsPickedUpUseCaseRequest): Promise<SetOrderAsPickedUpUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    const admin = await this.adminsRepository.findById(adminId)

    if(!admin) return left(new ResourceNotFoundError())

    await this.ordersRepository.setAsPickedUp(orderId)

    return right({})
  }
}