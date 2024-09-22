import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { CreateDeliveryManUseCase } from "./create-delivery-man"
import { makeDeliveryMan } from "test/factories/make-delivery-man"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let sut: CreateDeliveryManUseCase

describe("Create Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new CreateDeliveryManUseCase(deliveryMenRepository)
  })

  it("should be able to create a delivery man", async () => {
    const deliveryMan = makeDeliveryMan({ email: "johndoe@example.com" })

    const result = await sut.execute(deliveryMan)

    expect(result.isRight()).toBeTruthy()

    console.log(deliveryMenRepository.items)

    expect(deliveryMenRepository.items.length).toEqual(1)
  })

  it("should not create a delivery man with an existing email", async () => {
    const deliveryMan = makeDeliveryMan({ email: 'johndoe@example.com'})
    const secondDeliveryMan = makeDeliveryMan({ email: 'johndoe@example.com'})

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute(secondDeliveryMan)

    expect(result.isLeft()).toBeTruthy()
  })
})