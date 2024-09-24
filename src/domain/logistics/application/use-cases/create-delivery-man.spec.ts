import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { CreateDeliveryManUseCase } from "./create-delivery-man"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../enterprise/entities/value-objects/cpf"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let sut: CreateDeliveryManUseCase

describe("Create Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    sut = new CreateDeliveryManUseCase(deliveryMenRepository)
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

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute(secondDeliveryMan)

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})