import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { ListPendingOrdersUseCase } from "./list-pending-orders"

let deliverersRepository: InMemoryDelivererRepository
let ordersRepository: InMemoryOrdersRepository
let sut: ListPendingOrdersUseCase

describe("List pending orders use case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    ordersRepository = new InMemoryOrdersRepository()
    sut = new ListPendingOrdersUseCase(deliverersRepository, ordersRepository)
  })

  it("should be able to list all pending orders", async () => {
    const deliverer = makeDeliverer()

    const orders = Array.from({ length: 5 }, () => makeOrder({ 
      delivererId: deliverer.id, 
      status: OrderStatus.AWAITING_PICKUP,
    }))

    const inTransitOrders = Array.from({ length: 5 }, () => makeOrder({ delivererId: deliverer.id, status: OrderStatus.IN_TRANSIT }))

    await deliverersRepository.items.push(deliverer)
    await ordersRepository.items.push(...orders)
    await ordersRepository.items.push(...inTransitOrders)

    const response = await sut.execute({ 
      delivererId: deliverer.id.toString(), 
      page: 1, 
      perPage: 10,
      count: true 
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual(expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({ delivererId: deliverer.id, status: OrderStatus.IN_TRANSIT})
      ]),
      total: expect.any(Number)
    }))
  })
})