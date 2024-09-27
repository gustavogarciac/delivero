import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { DeleteDelivererUseCase } from "./delete-delivery-man"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { makeDeliverer } from "test/factories/make-deliverer"

let deliveryMenRepository: InMemoryDelivererRepository
let sut: DeleteDelivererUseCase

describe("Delete Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDelivererRepository()
    sut = new DeleteDelivererUseCase(deliveryMenRepository)
  })

  it("should be able to delete a delivery man", async () => {
    const deliverer = makeDeliverer()

    await deliveryMenRepository.items.push(deliverer)

    const result = await sut.execute({ delivererId: deliverer.id.toString() })

    expect(result.isRight()).toBeTruthy()

    expect(deliveryMenRepository.items.length).toEqual(0)
  })

  it("should throw an error if delivery man does not exist", async () => {
    const result = await sut.execute({ delivererId: "non-existing-id" })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})