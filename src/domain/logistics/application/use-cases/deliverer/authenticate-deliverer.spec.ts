import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { AuthenticateDelivererUseCase } from "./authenticate-deliverer"
import { makeDeliverer } from "test/factories/make-deliverer"

let delivererRepository: InMemoryDelivererRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateDelivererUseCase

describe("Authenticate Deliverer Use Case", async () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateDelivererUseCase(delivererRepository, fakeHasher, fakeEncrypter)
  })

  it("should be able to authenticate a delivery man", async () => {
    const deliverer = makeDeliverer({}, { cpf: Cpf.create("40171993055"), password: await fakeHasher.hash("password") })

    await delivererRepository.items.push(deliverer)

    const result = await sut.execute({
      cpf: deliverer.cpf,
      password: "password"
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(expect.objectContaining({
      accessToken: expect.any(String)
    }))
  })

  it("should not be able to authenticate a delivery man with wrong password", async () => {
    const deliverer = makeDeliverer()

    await delivererRepository.items.push(deliverer)

    const result = await sut.execute({
      cpf: deliverer.cpf,
      password: "wrong-password"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})