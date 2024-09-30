import { RegisterRecipientUseCase } from "./register-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { DeleteRecipientUseCase } from "./delete-recipient"

let recipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe("Delete Recipient Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(recipientsRepository)
  })

  it("should delete a recipient", async () => {
    const recipient = makeRecipient()

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute({ recipientId: recipient.id.toString() })

    expect(result.isRight()).toBeTruthy()

    expect(recipientsRepository.items[0]).toBeUndefined()
  })
})