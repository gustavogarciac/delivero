import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { GetRecipientReturnedOrdersUseCase } from "./get-recipient-returned-orders"
import { BadRequestError } from "@/core/errors/bad-request-error"

let recipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientReturnedOrdersUseCase

describe("Get Recipient Returned Orders Use Case", async () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientReturnedOrdersUseCase(recipientsRepository)
  })

  it("should get recipient returned orders", async () => {
    const recipient = makeRecipient({ name: "Recipient 1" })

    const order = makeOrder({ recipientId: recipient.id, status: OrderStatus.RETURNED })
    const order2 = makeOrder({ recipientId: recipient.id, status: OrderStatus.DELIVERED })

    recipient.orders = [order, order2]

    await recipientsRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(), 
      page: 1, 
      perPage: 10
    })
    
    expect(result.value).toEqual(expect.objectContaining({
      items: expect.arrayContaining([expect.objectContaining({ status: OrderStatus.RETURNED })]),
    }))
  })

  it("should get recipient returned orders with pagination", async () => {
    const recipient = makeRecipient({ name: "Recipient 1", orders: [] })

    for (let i = 0; i < 30; i++) {
      const order = makeOrder({ recipientId: recipient.id, status: OrderStatus.RETURNED })

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
      total: 10
    }))
  })

  it("should return error if recipient not found", async () => {
    const result = await sut.execute({
      recipientId: "invalid_id", 
      page: 1, 
      perPage: 10
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})