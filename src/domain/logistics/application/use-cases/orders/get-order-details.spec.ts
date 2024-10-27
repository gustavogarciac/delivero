import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { GetOrderDetailsUseCase } from "./get-order-details"

let ordersRepository: InMemoryOrdersRepository
let sut: GetOrderDetailsUseCase

describe("Get Order Details Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new GetOrderDetailsUseCase(ordersRepository)
  })

  it("should get an order details", async () => {
    const order = makeOrder()

    await ordersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      order: expect.objectContaining({
        trackingNumber: order.trackingNumber
      })
    })
  })
})