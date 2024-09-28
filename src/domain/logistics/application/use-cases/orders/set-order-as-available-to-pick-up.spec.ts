import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { SetOrderAsAvailableToPickUpUseCase } from "./set-order-as-available-to-pick-up"

let ordersRepository: InMemoryOrdersRepository
let sut: SetOrderAsAvailableToPickUpUseCase

describe("Set Order as Available to pick up Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new SetOrderAsAvailableToPickUpUseCase(ordersRepository)
  })

  it("should set an order as awaiting pick up", async () => {
    const order = makeOrder({ status: OrderStatus.PREPARING })

    await ordersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    expect(ordersRepository.items[0].status).toBe(OrderStatus.AWAITING_PICKUP)
  })
})