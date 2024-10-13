import { makeOrder } from "test/factories/make-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { SendNotificationUseCase } from "../application/use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { waitFor } from "test/utils/wait-for"
import { OnOrderDelivered } from "./on-order-delivered"
import { FakeMailer } from "test/mailer/mailer"

let ordersRepository: InMemoryOrdersRepository
let recipientsRepository: InMemoryRecipientsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let mailer: FakeMailer

let sendNotificationExecuteSpy;

describe("On order delivered", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    recipientsRepository = new InMemoryRecipientsRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    mailer = new FakeMailer()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    const onOrderDelivered = new OnOrderDelivered(recipientsRepository, sendNotificationUseCase, mailer)
  })

  it("should send a notification when an order is delivered", async () => {
    const recipient = makeRecipient()
    const order = makeOrder({ recipientId: recipient.id, status: OrderStatus.IN_TRANSIT })

    order.setAsDelivered()

    await recipientsRepository.create(recipient)
    await ordersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith({
        content: `Your order with tracking code: ${order.trackingNumber} has been delivered`,
        recipientId: recipient.id.toString(),
        title: "Your order has been delivered"
      })
    })

    expect(mailer.getSentEmails()).toEqual([
      {
        to: recipient.email,
        subject: "Your order has been delivered",
        body: `
          <h1>Your order has been delivered</h1>
          <p>Your order with tracking code: ${order.trackingNumber} has been delivered</p>
        `
      }
    ])
  })
})