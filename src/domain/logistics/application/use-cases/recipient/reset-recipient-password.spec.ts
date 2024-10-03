import { makeRecipient } from "test/factories/make-recipient"
import { FakeMailer } from "test/mailer/mailer"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { ResetRecipientPasswordUseCase } from "./reset-recipient-password"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { InMemoryRecipientTokensRepository } from "test/repositories/in-memory-recipient-tokens-repository"

let recipientsRepository: InMemoryRecipientsRepository
let recipientTokensRepository: InMemoryRecipientTokensRepository
let fakeMailer: FakeMailer
let sut: ResetRecipientPasswordUseCase

describe("Reset recipient password use case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    recipientTokensRepository = new InMemoryRecipientTokensRepository()
    fakeMailer = new FakeMailer()
    sut = new ResetRecipientPasswordUseCase(recipientsRepository, recipientTokensRepository, fakeMailer)
  })

  it("should be able to request recipient's password reset", async () => {
    const recipient = makeRecipient()

    await recipientsRepository.items.push(recipient)
  
    const response = await sut.execute({
      email: recipient.email
    })

    expect(response.isRight()).toBe(true)

    expect(response.value).toEqual({ otp: expect.any(String) })

    expect(recipientTokensRepository.items).toHaveLength(1)
    expect(recipientTokensRepository.items[0].recipientId).toBe(recipient.id.toString())
  })

  it("should send an email with the reset link", async () => {
    const recipient = makeRecipient()

    await recipientsRepository.items.push(recipient)
  
    await sut.execute({
      email: recipient.email
    })

    expect(fakeMailer.getSentEmails()).toHaveLength(1)
    expect(fakeMailer.getSentEmails()[0].to).toBe(recipient.email)
    expect(fakeMailer.getSentEmails()[0].subject).toBe("Your password reset code")
  })

  it("should not be able to request recipient's password reset if recipient does not exist", async () => {
    const response = await sut.execute({
      email: "non-existing-user@email.com"
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(BadRequestError)
  })
})