import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { CreateDeliveryManUseCase } from "./create-delivery-man"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../enterprise/entities/value-objects/cpf"
import { FakeHasher } from "test/cryptography/fake-hasher"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let hasher: FakeHasher
let sut: CreateDeliveryManUseCase

describe("Create Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    hasher = new FakeHasher()
    sut = new CreateDeliveryManUseCase(deliveryMenRepository, hasher)
  })

  it("should be able to create a delivery man", async () => {
    const deliveryMan = makeDeliveryMan({ cpf: Cpf.create("40171993055") })

    const result = await sut.execute(deliveryMan)

    expect(result.isRight()).toBeTruthy()

    expect(deliveryMenRepository.items.length).toEqual(1)
  })

  it("should not create a delivery man with an existing cpf", async () => {
    const deliveryMan = makeDeliveryMan({ cpf: Cpf.create("40171993055") })
    const secondDeliveryMan = makeDeliveryMan({ cpf: Cpf.create("40171993055") })

    deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute(secondDeliveryMan)

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })

  it("should hash the password before saving", async () => {
    const result = await sut.execute({
      cpf: Cpf.create("40171993055"),
      name: "John Doe",
      password: "password"
    })
    
    expect(result.isRight()).toBeTruthy()

    const hashedPassword = await hasher.hash("password")

    expect(deliveryMenRepository.items[0].password).toEqual(hashedPassword)
  })
})