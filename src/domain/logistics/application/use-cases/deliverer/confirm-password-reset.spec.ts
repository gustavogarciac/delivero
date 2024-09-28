import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { ConfirmPasswordResetUseCase } from "./confirm-password-reset"

let delivererRepository: InMemoryDelivererRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: ConfirmPasswordResetUseCase

describe("Confirm Password Reset Use Case", async () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new ConfirmPasswordResetUseCase(delivererRepository, fakeEncrypter, fakeHasher)
  })

  it("should be able to confirm a password reset", async () => {
    const deliverer = makeDeliverer({}, { cpf: Cpf.create("40171993055"), password: await fakeHasher.hash("password") })

    await delivererRepository.items.push(deliverer)

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      newPassword: "new-password",
      token: await fakeEncrypter.encrypt({ sub: deliverer.id })
    })

    expect(result.isRight()).toBeTruthy()

    expect(delivererRepository.items[0].password).toEqual("new-passwordhashed")
  })
})