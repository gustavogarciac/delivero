import { CreateOrderUseCase } from "./create-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"

let ordersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe("Get Order Details Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new CreateOrderUseCase(ordersRepository)
  })

  it("should get an order details", async () => {
    const order = makeOrder()

    const result = await sut.execute(order)

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      order: expect.objectContaining({
        trackingNumber: order.trackingNumber
      })
    })
  })
})