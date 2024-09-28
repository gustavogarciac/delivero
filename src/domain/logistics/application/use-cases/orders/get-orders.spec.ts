import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { GetOrdersUseCase } from "./get-orders"
import { Order } from "@/domain/logistics/enterprise/entities/order"

let ordersRepository: InMemoryOrdersRepository
let sut: GetOrdersUseCase

describe("Get Orders Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new GetOrdersUseCase(ordersRepository)
  })

  it("should get all orders", async () => {
    for (let i = 0; i < 20; i++) {
      const order = makeOrder()

      await ordersRepository.items.push(order)
    }

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      count: true,
    })

    expect(result.isRight()).toBeTruthy()
    
    expect(result.value).toEqual(expect.objectContaining({
      items: expect.any(Array),
      total: 20
    }))
  })

  it("should get all orders with pagination", async () => {
    for (let i = 0; i < 20; i++) {
      const order = makeOrder()

      await ordersRepository.items.push(order)
    }

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      count: false,
    })

    expect(result.isRight()).toBeTruthy()

    const { items } = result.value as { items: Order[] }

    expect(items.length).toBe(10)
  })

  it("should get all orders with pagination and query", async () => {
    for (let i = 0; i < 20; i++) {
      const order = makeOrder()

      await ordersRepository.items.push(order)
    }

    const order = await makeOrder()

    await ordersRepository.items.push(order)

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      query: order.pickupCode,
      count: false,
    })

    expect(result.isRight()).toBeTruthy()

    const { items } = result.value as { items: Order[] }

    expect(items.length).toBe(1)
  })
})