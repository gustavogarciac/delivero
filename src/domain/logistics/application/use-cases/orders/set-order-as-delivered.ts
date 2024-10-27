import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { OrderAttachmentsRepository } from "../../repositories/order-attachments-repository"
import { Injectable } from "@nestjs/common"

interface SetOrderAsDeliveredUseCaseRequest {
  orderId: string
  delivererId: string
}

type SetOrderAsDeliveredUseCaseResponse = Either<ResourceNotFoundError | BadRequestError, object>

@Injectable()
export class SetOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository, 
    private deliverersRepository: DeliverersRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository
  ) {}

  async execute({
    orderId,
    delivererId,
  } : SetOrderAsDeliveredUseCaseRequest): Promise<SetOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    if(order.status !== OrderStatus.IN_TRANSIT)
      return left(new BadRequestError("You can only set an order as delivered if it is in transit"))

    const delivererAssignedToOrder = order.delivererId?.equals(deliverer.id)

    if(!delivererAssignedToOrder) {
      return left(new BadRequestError("You are not assigned to this order"))
    }

    const orderDeliveredAttachmentConfirmation = await this.orderAttachmentsRepository.findByOrderDelivererId(orderId, delivererId)

    if(!orderDeliveredAttachmentConfirmation) {
      return left(new BadRequestError("You must attach a picture to confirm the order delivery"))
    }
    
    order.setAsDelivered()
    deliverer.deliverOrder(order)

    await this.ordersRepository.save(order)
    await this.deliverersRepository.save(deliverer)

    return right({})
  }
}