import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { GetRecipientDetailsUseCase } from "./get-recipient-details"

let recipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientDetailsUseCase

describe("Get Recipients Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientDetailsUseCase(recipientsRepository)
  })

  it("should get recipient details", async () => {
    const recipient = makeRecipient({ name: "Recipient 1" })

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute({ recipientId: recipient.id.toString() })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      recipient: expect.objectContaining({ name: "Recipient 1" })
    })
  })
})