import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { GetDelivererProfileUseCase } from "./get-delivery-man-profile"
import { makeDeliverer } from "test/factories/make-deliverer"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

let deliverersRepository: InMemoryDelivererRepository
let sut: GetDelivererProfileUseCase

describe("Get Delivery Man Profile Use Case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    sut = new GetDelivererProfileUseCase(deliverersRepository)
  })

  it("should be able to get a delivery man profile", async () => {
    const deliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(expect.objectContaining({
      deliverer: expect.objectContaining({
        name: deliverer.name,
      })
    }))
  })

  it("should throw an error if delivery man does not exist", async () => {
    const result = await sut.execute({
      delivererId: "non-existing-id",
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})