import { Recipient, RecipientProps } from "@/domain/logistics/enterprise/entities/recipient"
import { RegisterRecipientUseCase } from "./register-recipient"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { BadRequestError } from "@/core/errors/bad-request-error"

let recipientsRepository: InMemoryRecipientsRepository
let sut: RegisterRecipientUseCase

describe("Register Recipient Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new RegisterRecipientUseCase(recipientsRepository)
  })

  it("should register a recipient", async () => {
    const recipient: RecipientProps = {
      address: "Rua dos Bobos, 0",
      city: "São Paulo",
      country: "Brazil",
      email: "john@doe.com",
      name: "John Doe",
      phone: "5511999999999",
      state: "SP",
      zip: "00000-000"
    }

    const result = await sut.execute(recipient)

    expect(result.isRight()).toBeTruthy()

    expect(recipientsRepository.items[0]).toEqual(expect.objectContaining(recipient))
  })

  it("should not register recipient with same email", async () => {
    const recipient = makeRecipient()

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute(recipient)

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})