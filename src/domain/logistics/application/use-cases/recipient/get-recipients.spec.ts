import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { GetRecipientsUseCase } from "./get-recipients"
import { Order } from "@/domain/logistics/enterprise/entities/order"
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient"

let recipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientsUseCase

describe("Get Recipients Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientsUseCase(recipientsRepository)
  })

  it("should get recipients", async () => {
    for (let i = 0; i < 22; i++) {
      const recipient = makeRecipient()

      await recipientsRepository.items.push(recipient)
    }

    const result = await sut.execute({ page: 1, perPage: 10, count: true })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(expect.objectContaining({
      items: expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]),
      total: 22
    }))
  })

  it("should get recipients with query", async () => {
    for (let i = 0; i < 22; i++) {
      const recipient = makeRecipient()

      await recipientsRepository.items.push(recipient)
    }

    const recipientToBeFound = makeRecipient({ name: 'John Doe' })

    await recipientsRepository.items.push(recipientToBeFound)

    const result = await sut.execute({ page: 1, perPage: 10, count: true, query: 'John Doe' })

    expect(result.isRight()).toBeTruthy()

    const { items } = result.value as { items: Recipient[] }

    expect(items.length).toBe(1)
  })
})