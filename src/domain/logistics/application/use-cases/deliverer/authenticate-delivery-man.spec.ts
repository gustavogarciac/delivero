import { InMemoryDeliveryMenRepository } from "test/repositories/in-memory-delivery-men-repository"
import { makeDeliveryMan } from "test/factories/make-delivery-man"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { AuthenticateDeliveryManUseCase } from "./authenticate-delivery-man"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { BadRequestError } from "@/core/errors/bad-request-error"

let deliveryMenRepository: InMemoryDeliveryMenRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateDeliveryManUseCase

describe("Authenticate Delivery Man Use Case", async () => {
  beforeEach(async () => {
    deliveryMenRepository = new InMemoryDeliveryMenRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateDeliveryManUseCase(deliveryMenRepository, fakeHasher, fakeEncrypter)
  })

  it("should be able to authenticate a delivery man", async () => {
    const deliveryMan = makeDeliveryMan({ cpf: Cpf.create("40171993055"), password: await fakeHasher.hash("password") })

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute({
      cpf: deliveryMan.cpf,
      password: "password"
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(expect.objectContaining({
      accessToken: expect.any(String)
    }))
  })

  it("should not be able to authenticate a delivery man with wrong password", async () => {
    const deliveryMan = makeDeliveryMan()

    await deliveryMenRepository.items.push(deliveryMan)

    const result = await sut.execute({
      cpf: deliveryMan.cpf,
      password: "wrong-password"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})