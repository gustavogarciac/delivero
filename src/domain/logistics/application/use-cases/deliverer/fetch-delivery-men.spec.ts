import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { FetchDeliverersUseCase } from "./fetch-delivery-men"
import { makeDeliverer } from "test/factories/make-deliverer"

let deliverersRepository: InMemoryDelivererRepository
let sut: FetchDeliverersUseCase

describe("Fetch Delivery Men Use Case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    sut = new FetchDeliverersUseCase(deliverersRepository)
  })

  it("should be able to fetch delivery men", async () => {
    for (let i = 0; i <= 22; i++) {
      const deliveryMan = makeDeliverer()

      await deliverersRepository.items.push(deliveryMan)
    }

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      count: true,
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      items: deliverersRepository.items.slice(0, 10),
      total: 10,
    })
  })

  it("should paginate when fetching delivery men", async () => {
    for (let i = 0; i <= 22; i++) {
      const deliveryMan = makeDeliverer()

      await deliverersRepository.items.push(deliveryMan)
    }

    const result = await sut.execute({
      page: 2,
      perPage: 10,
      count: true,
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      items: deliverersRepository.items.slice(10, 20),
      total: 10,
    })
  })
})