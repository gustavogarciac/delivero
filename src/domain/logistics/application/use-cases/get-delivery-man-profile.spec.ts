import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { GetDeliveryManProfileUseCase } from "./get-delivery-man-profile"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let sut: GetDeliveryManProfileUseCase

describe("Get Delivery Man Profile Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new GetDeliveryManProfileUseCase(deliveryMenRepository)
  })

  it("should be able to get a delivery man profile", async () => {
    const deliveryMan = makeDeliveryMan()

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute({ deliveryManId: deliveryMan.id.toString() })

    expect(result.isRight()).toBeTruthy()

    expect(deliveryMenRepository.items.length).toEqual(1)
  })

  it("should throw an error if delivery man does not exist", async () => {
    const result = await sut.execute({ deliveryManId: "non-existing-id" })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})