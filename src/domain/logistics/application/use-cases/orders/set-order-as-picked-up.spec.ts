import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { SetOrderAsPickedUpUseCase } from "./set-order-as-picked-up"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let ordersRepository: InMemoryOrdersRepository
let deliverersRepository: InMemoryDelivererRepository
let sut: SetOrderAsPickedUpUseCase

describe("Set Order as Picked Up Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    sut = new SetOrderAsPickedUpUseCase(ordersRepository, deliverersRepository)
  })

  it("should set an order as picked up by a deliverer", async () => {
    const deliverer = makeDeliverer({ deliveriesCount: 0 }, {}, new UniqueEntityId("deliverer-id"))
    const order = makeOrder({ status: OrderStatus.AWAITING_PICKUP })

    await ordersRepository.items.push(order)
    await deliverersRepository.items.push(deliverer)

    const result = await sut.execute({ 
      orderId: order.id.toString(),
      delivererId: deliverer.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    expect(ordersRepository.items[0].status).toBe(OrderStatus.IN_TRANSIT)
    expect(ordersRepository.items[0].pickedAt).not.toBeNull()

    expect(deliverer.orders).toEqual([
      expect.objectContaining({ id: order.id, status: OrderStatus.IN_TRANSIT })
    ])
  })
})