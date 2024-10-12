import { makeOrder } from "test/factories/make-order"
import { OnOrderCreated } from "./on-order-created"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { SendNotificationUseCase } from "../application/use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { waitFor } from "test/utils/wait-for"

let ordersRepository: InMemoryOrdersRepository
let recipientsRepository: InMemoryRecipientsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy;

describe("On order created", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    recipientsRepository = new InMemoryRecipientsRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    const onOrderCreated = new OnOrderCreated(recipientsRepository, sendNotificationUseCase)
  })

  it("should send a notification when an order is created", async () => {
    const recipient = makeRecipient()
    const order = makeOrder({ recipientId: recipient.id, status: OrderStatus.PREPARING })

    await recipientsRepository.create(recipient)
    await ordersRepository.create(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})