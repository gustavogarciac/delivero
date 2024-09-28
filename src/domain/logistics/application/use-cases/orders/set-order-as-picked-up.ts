import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Order } from "../../../enterprise/entities/order"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { AdminsRepository } from "../../repositories/admins-repository"
import { DeliverersRepository } from "../../repositories/deliverers-repository"

interface SetOrderAsPickedUpUseCaseRequest {
  orderId: string
  adminId: string
  delivererId: string
}

type SetOrderAsPickedUpUseCaseResponse = Either<ResourceNotFoundError, object>

export class SetOrderAsPickedUpUseCase {
  constructor(
    private ordersRepository: OrdersRepository, 
    private adminsRepository: AdminsRepository, 
    private deliverersRepository: DeliverersRepository
  ) {}

  async execute({
    orderId,
    delivererId,
    adminId
  } : SetOrderAsPickedUpUseCaseRequest): Promise<SetOrderAsPickedUpUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    const admin = await this.adminsRepository.findById(adminId)

    if(!admin) return left(new ResourceNotFoundError())

    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new ResourceNotFoundError())
    
    await this.adminsRepository.attendOrderToDeliverer(order, delivererId)
    await this.ordersRepository.setAsPickedUp(orderId, delivererId)

    return right({})
  }
}