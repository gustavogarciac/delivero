import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { UpdateDeliveryManUseCase } from "./update-delivery-man"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let hasher: FakeHasher
let sut: UpdateDeliveryManUseCase

describe("Update Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    hasher = new FakeHasher()
    sut = new UpdateDeliveryManUseCase(deliveryMenRepository, hasher)
  })

  it("should be able to update a delivery man", async () => {
    const deliveryMan = makeDeliveryMan()

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      cpf: deliveryMan.cpf,
      name: "John Doe",
      password: "password"
    })

    expect(result.isRight()).toBeTruthy()

    expect(deliveryMenRepository.items[0].name).toEqual("John Doe")
  })

  it("should throw an error if delivery man does not exist", async () => {
    const result = await sut.execute({
      deliveryManId: "non-existing-id",
      cpf: Cpf.create(), 
      name: "John Doe", 
      password: "password" 
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})