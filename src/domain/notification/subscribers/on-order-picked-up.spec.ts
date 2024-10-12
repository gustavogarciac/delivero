import { makeOrder } from "test/factories/make-order"
import { OnOrderCreated } from "./on-order-created"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository"
import { SendNotificationUseCase } from "../application/use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { waitFor } from "test/utils/wait-for"
import { OnOrderPickedUp } from "./on-order-picked-up"
import { makeDeliverer } from "test/factories/make-deliverer"

let ordersRepository: InMemoryOrdersRepository
let recipientsRepository: InMemoryRecipientsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy;

describe("On order picked up by deliverer", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    recipientsRepository = new InMemoryRecipientsRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    const onOrderPickedUp = new OnOrderPickedUp(recipientsRepository, sendNotificationUseCase)
  })

  it("should send a notification when an order is picked up by a deliverer", async () => {
    const recipient = makeRecipient()
    const deliverer = makeDeliverer()
    const order = makeOrder({ recipientId: recipient.id, status: OrderStatus.AWAITING_PICKUP })

    order.setAsPickedUp(deliverer.id.toString())

    await recipientsRepository.create(recipient)
    await ordersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith({
        content: `Your order with tracking code: ${order.trackingNumber} has been picked up by a deliverer and is on its way to you`,
        recipientId: recipient.id.toString(),
        title: "Your order has been picked up"
      })
    })
  })
})