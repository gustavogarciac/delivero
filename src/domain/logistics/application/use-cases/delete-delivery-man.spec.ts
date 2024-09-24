import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { DeleteDeliveryManUseCase } from "./delete-delivery-man"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let sut: DeleteDeliveryManUseCase

describe("Delete Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new DeleteDeliveryManUseCase(deliveryMenRepository)
  })

  it("should be able to delete a delivery man", async () => {
    const deliveryMan = makeDeliveryMan()

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute({ deliveryManId: deliveryMan.id.toString() })

    expect(result.isRight()).toBeTruthy()

    expect(deliveryMenRepository.items.length).toEqual(0)
  })

  it("should throw an error if delivery man does not exist", async () => {
    const result = await sut.execute({ deliveryManId: "non-existing-id" })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})