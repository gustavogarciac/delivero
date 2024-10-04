import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeDeliverer } from "test/factories/make-deliverer"
import { ConfirmDelivererPasswordResetUseCase } from "./confirm-deliverer-password-reset"
import { InMemoryDelivererTokenRepository } from "test/repositories/in-memory-deliverer-tokens-repository"
import { DelivererToken } from "@/domain/logistics/enterprise/entities/delivererTokens"
import { Otp } from "@/domain/logistics/enterprise/entities/value-objects/otp"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"

let delivererRepository: InMemoryDelivererRepository
let delivererTokensRepository: InMemoryDelivererTokenRepository
let fakeHasher: FakeHasher
let sut: ConfirmDelivererPasswordResetUseCase

describe("Confirm Deliverer Password Reset Use Case", async () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    delivererTokensRepository = new InMemoryDelivererTokenRepository()
    fakeHasher = new FakeHasher()
    sut = new ConfirmDelivererPasswordResetUseCase(delivererRepository, delivererTokensRepository, fakeHasher)
  })

  it("should be able to confirm a password reset", async () => {
    const deliverer = makeDeliverer()

    await delivererRepository.items.push(deliverer)

    const otp = Otp.generate(6, 10)

    const delivererToken = DelivererToken.create({
      expiration: otp.expiration,
      delivererId: deliverer.id.toString(),
      token: otp.value
    })

    await delivererTokensRepository.items.push(delivererToken)

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      newPassword: "new-password",
      token: otp.value
    })

    expect(result.isRight()).toBeTruthy()

    expect(delivererRepository.items[0].password).toEqual("new-passwordhashed")
  })
})