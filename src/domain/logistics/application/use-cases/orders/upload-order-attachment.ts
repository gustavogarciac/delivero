import { Either, left, right } from "@/core/either"
import { OrdersRepository } from "../../repositories/orders-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Uploader } from "../../uploader/uploder"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { OrderAttachment } from "@/domain/logistics/enterprise/entities/order-attachment"
import { OrderAttachmentsRepository } from "../../repositories/order-attachments-repository"
import { Injectable } from "@nestjs/common"

interface UploadOrderAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
  orderId: string
  delivererId: string
}

type UploadOrderAttachmentUseCaseResponse = Either<ResourceNotFoundError | BadRequestError, {
  orderAttachment: OrderAttachment
}>

@Injectable()
export class UploadOrderAttachmentUseCase {
  constructor(
    private ordersRepository: OrdersRepository, 
    private deliverersRepository: DeliverersRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
    private uploader: Uploader
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    orderId,
    delivererId,
  } : UploadOrderAttachmentUseCaseRequest): Promise<UploadOrderAttachmentUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if(!order) return left(new ResourceNotFoundError())

    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new ResourceNotFoundError())

    const delivererAssignedToOrder = order.delivererId?.toString() === delivererId

    if(!delivererAssignedToOrder) return left(new BadRequestError("Deliverer is not assigned to this order"))

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const orderAttachment = OrderAttachment.create({ orderId, delivererId }, { url, title: fileName })

    await this.orderAttachmentsRepository.create(orderAttachment)

    return right({ orderAttachment })
  }
}