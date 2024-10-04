import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeRecipient } from "test/factories/make-recipient"
import { ConfirmRecipientPasswordResetUseCase } from "./confirm-recipient-password-reset"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { InMemoryRecipientTokenRepository } from "test/repositories/in-memory-recipient-tokens-repository"
import { RecipientToken } from "@/domain/logistics/enterprise/entities/recipientTokens"
import { Otp } from "@/domain/logistics/enterprise/entities/value-objects/otp"

let recipientRepository: InMemoryRecipientsRepository
let recipientTokensRepository: InMemoryRecipientTokenRepository
let fakeHasher: FakeHasher
let sut: ConfirmRecipientPasswordResetUseCase

describe("Confirm Recipient Password Reset Use Case", async () => {
  beforeEach(async () => {
    recipientRepository = new InMemoryRecipientsRepository()
    recipientTokensRepository = new InMemoryRecipientTokenRepository()
    fakeHasher = new FakeHasher()
    sut = new ConfirmRecipientPasswordResetUseCase(recipientRepository, recipientTokensRepository, fakeHasher)
  })

  it("should be able to confirm a password reset", async () => {
    const recipient = makeRecipient()

    await recipientRepository.items.push(recipient)

    const otp = Otp.generate(6, 10)

    const recipientToken = RecipientToken.create({
      expiration: otp.expiration,
      recipientId: recipient.id.toString(),
      token: otp.value
    })

    await recipientTokensRepository.items.push(recipientToken)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      newPassword: "new-password",
      token: otp.value
    })

    expect(result.isRight()).toBeTruthy()

    expect(recipientRepository.items[0].password).toEqual("new-passwordhashed")
  })
})