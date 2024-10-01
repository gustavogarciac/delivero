import { RecipientProps } from "@/domain/logistics/enterprise/entities/recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { UpdateRecipientUseCase } from "./update-recipient"

let recipientsRepository: InMemoryRecipientsRepository
let sut: UpdateRecipientUseCase

describe("Update Recipient Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new UpdateRecipientUseCase(recipientsRepository)
  })

  it("should update a recipient", async () => {
    const recipient = makeRecipient()

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute({
      address: "new address",
      city: "new city",
      country: "new country",
      email: "new email",
      name: "new name",
      phone: "new phone",
      state: "new state",
      zip: "new zip",
      recipientId: recipient.id.toString()
    })

    expect(result.isRight()).toBeTruthy()

    expect(recipientsRepository.items[0]).toEqual(expect.objectContaining(recipient))
  })

  it("should return a BadRequestError if recipient is not found", async () => {
    const result = await sut.execute({
      address: "new address",
      city: "new city",
      country: "new country",
      email: "new email",
      name: "new name",
      phone: "new phone",
      state: "new state",
      zip: "new zip",
      recipientId: "invalid id"
    })
    
    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})