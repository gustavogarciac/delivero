import { CreateOrderUseCase } from "./create-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let ordersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe("Get Order Details Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new CreateOrderUseCase(ordersRepository)
  })

  it("should get an order details", async () => {
    const order = makeOrder()

    const result = await sut.execute({
      delivererId: new UniqueEntityId('01923ae4-cae0-7ddf-a8f4-6b97396894c9'),
      deliveryAddress: order.deliveryAddress,
      geo: order.geo,
      recipientId: order.recipientId,
      adminId: order.adminId,
      notes: order.notes,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      order: expect.objectContaining({
        trackingNumber: order.trackingNumber
      })
    })
  })
})