import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { SetOrderAsDeliveredUseCase } from "./set-order-as-delivered"
import { InMemoryOrderAttachmentsRepository } from "test/repositories/in-memory-order-attachments-repository"
import { makeOrderAttachment } from "test/factories/make-order-attachment"
import { BadRequestError } from "@/core/errors/bad-request-error"

let ordersRepository: InMemoryOrdersRepository
let deliverersRepository: InMemoryDelivererRepository
let orderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let sut: SetOrderAsDeliveredUseCase

describe("Set Order as Delivered Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    orderAttachmentsRepository = new InMemoryOrderAttachmentsRepository()
    sut = new SetOrderAsDeliveredUseCase(ordersRepository, deliverersRepository, orderAttachmentsRepository)
  })

  it("should set an order as picked up by a deliverer", async () => {
    const deliverer = makeDeliverer({ deliveriesCount: 0 }, {}, new UniqueEntityId("deliverer-id"))
    const order = makeOrder({ status: OrderStatus.IN_TRANSIT, delivererId: deliverer.id })
    const orderAttachment = makeOrderAttachment({ delivererId: deliverer.id.toString(), orderId: order.id.toString() })

    await deliverersRepository.items.push(deliverer)
    await ordersRepository.items.push(order)
    await orderAttachmentsRepository.items.push(orderAttachment)

    const result = await sut.execute({ 
      orderId: order.id.toString(), 
      delivererId: deliverer.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    expect(ordersRepository.items[0].status).toBe(OrderStatus.DELIVERED)

    expect(deliverer.deliveriesCount).toBe(1)
  })

  it("should thrown an error if order is not in transit", async () => {
    const deliverer = makeDeliverer({ deliveriesCount: 0 })
    const order = makeOrder({ status: OrderStatus.PREPARING })
    const orderAttachment = makeOrderAttachment({ delivererId: deliverer.id.toString(), orderId: order.id.toString() })

    await deliverersRepository.items.push(deliverer)
    await ordersRepository.items.push(order)
    await orderAttachmentsRepository.items.push(orderAttachment)

    const result = await sut.execute({
      orderId: order.id.toString(),
      delivererId: deliverer.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })

  it("should thrown an error if deliverer is not found", async () => {
    const deliverer = makeDeliverer({ deliveriesCount: 0 })
    const order = makeOrder({ status: OrderStatus.PREPARING })
    const orderAttachment = makeOrderAttachment({ delivererId: deliverer.id.toString(), orderId: order.id.toString() })

    await deliverersRepository.items.push(deliverer)
    await ordersRepository.items.push(order)
    await orderAttachmentsRepository.items.push(orderAttachment)

    const result = await sut.execute({
      orderId: order.id.toString(),
      delivererId: deliverer.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })

  it("should thrown an error if deliverer is not assigned to the order", async () => {
    const order = makeOrder({ status: OrderStatus.IN_TRANSIT })
    const orderAttachment = makeOrderAttachment({ orderId: order.id.toString() })

    await ordersRepository.items.push(order)
    await orderAttachmentsRepository.items.push(orderAttachment)

    const result = await sut.execute({
      orderId: order.id.toString(),
      delivererId: "non-existing-deliverer-id",
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})