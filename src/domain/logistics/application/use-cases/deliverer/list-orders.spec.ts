import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { ListPendingOrdersUseCase } from "./list-pending-orders"
import { ListOrdersUseCase } from "./list-orders"

let deliverersRepository: InMemoryDelivererRepository
let ordersRepository: InMemoryOrdersRepository
let sut: ListOrdersUseCase

describe("List orders use case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    ordersRepository = new InMemoryOrdersRepository()
    sut = new ListOrdersUseCase(deliverersRepository, ordersRepository)
  })

  it("should be able to list all orders", async () => {
    const deliverer = makeDeliverer()

    for (let i = 0; i < 10; i++) {
      const order = makeOrder({ delivererId: deliverer.id })

      await ordersRepository.items.push(order)
    }

    await deliverersRepository.items.push(deliverer)

    const response = await sut.execute({ 
      delivererId: deliverer.id.toString(), 
      page: 1, 
      perPage: 10,
      count: true
    })

    expect(response.isRight()).toBeTruthy()

    expect(response.value).toEqual(expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({ delivererId: deliverer.id })
      ]),
      total: expect.any(Number)
    }))
  })
})