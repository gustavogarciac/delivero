import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { SetOrderAsReturnedUseCase } from "./set-order-as-returned"

let ordersRepository: InMemoryOrdersRepository
let sut: SetOrderAsReturnedUseCase

describe("Set Order as Returned Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new SetOrderAsReturnedUseCase(ordersRepository)
  })

  it("should set an order as returned", async () => {
    const order = makeOrder({ status: OrderStatus.DELIVERED })

    await ordersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    expect(ordersRepository.items[0].status).toBe(OrderStatus.RETURNED)
  })
})