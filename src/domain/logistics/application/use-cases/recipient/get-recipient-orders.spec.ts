import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { GetRecipientOrdersUseCase } from "./get-recipient-orders"
import { makeOrder } from "test/factories/make-order"
import { BadRequestError } from "@/core/errors/bad-request-error"

let recipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientOrdersUseCase

describe("Get Recipient Orders Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientOrdersUseCase(recipientsRepository)
  })

  it("should get recipient orders", async () => {
    const recipient = makeRecipient({ name: "Recipient 1" })

    const orders = [makeOrder({ recipientId: recipient.id })]

    recipient.orders = orders

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute({ 
      recipientId: recipient.id.toString(), 
      page: 1, 
      perPage: 10
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(expect.objectContaining({
      items: orders,
    }))
  })

  it("should get recipient orders with pagination", async () => {
    const recipient = makeRecipient({ name: "Recipient 1", orders: [] })

    for (let i = 0; i < 30; i++) {
      const order = makeOrder({ recipientId: recipient.id })

      recipient.orders?.push(order)
    }

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      page: 2,
      perPage: 10,
      count: true
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual(expect.objectContaining({
      items: recipient.orders?.slice(10, 20),
      total: 30
    }))
  })

  it("should return an error if recipient does not exist", async () => {
    const result = await sut.execute({ 
      recipientId: "1", 
      page: 1, 
      perPage: 10
    })
      
    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})