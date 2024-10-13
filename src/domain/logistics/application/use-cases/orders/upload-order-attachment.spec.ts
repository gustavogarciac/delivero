import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { FakeUploader } from "test/uploader/fake-uploader"
import { makeDeliverer } from "test/factories/make-deliverer"
import { UploadOrderAttachmentUseCase } from "./upload-order-attachment"
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository"

let ordersRepository: InMemoryOrdersRepository
let deliverersRepository: InMemoryDelivererRepository
let orderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let uploader: FakeUploader
let sut: UploadOrderAttachmentUseCase

describe("Upload order attachment use case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    orderAttachmentsRepository = new InMemoryOrderAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadOrderAttachmentUseCase(ordersRepository, deliverersRepository, orderAttachmentsRepository,uploader)
  })

  it("should upload an order attachment", async () => {
    const deliverer = makeDeliverer()
    await deliverersRepository.save(deliverer)

    const order = makeOrder({ status: OrderStatus.IN_TRANSIT, delivererId: deliverer.id })
    await ordersRepository.save(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      delivererId: deliverer.id.toString(),
      fileName: 'file-name.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from('file-content'),
    })

    expect(response.isRight()).toBeTruthy()

    expect(response.value).toEqual({
      orderAttachment: expect.objectContaining({
        orderId: order.id.toString(),
        delivererId: deliverer.id.toString(),
      })
    })

    expect(orderAttachmentsRepository.items).toHaveLength(1)
  })
})