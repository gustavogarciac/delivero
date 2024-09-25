import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { FetchDeliveryMenUseCase } from "./fetch-delivery-men"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let sut: FetchDeliveryMenUseCase

describe("Fetch Delivery Men Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new FetchDeliveryMenUseCase(deliveryMenRepository)
  })

  it("should be able to fetch delivery men", async () => {
    for (let i = 0; i <= 22; i++) {
      const deliveryMan = makeDeliveryMan()

      await deliveryMenRepository.items.push(deliveryMan)
    }

    const result = await sut.execute({
      page: 1,
      perPage: 10,
      count: true,
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      items: deliveryMenRepository.items.slice(0, 10),
      total: 10,
    })
  })

  it("should paginate when fetching delivery men", async () => {
    for (let i = 0; i <= 22; i++) {
      const deliveryMan = makeDeliveryMan()

      await deliveryMenRepository.items.push(deliveryMan)
    }

    const result = await sut.execute({
      page: 2,
      perPage: 10,
      count: true,
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      items: deliveryMenRepository.items.slice(10, 20),
      total: 10,
    })
  })
})