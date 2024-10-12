import { makeOrder } from "test/factories/make-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { SendNotificationUseCase } from "../application/use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeRecipient } from "test/factories/make-recipient"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { waitFor } from "test/utils/wait-for"
import { OnOrderPickedUp } from "./on-order-picked-up"
import { makeDeliverer } from "test/factories/make-deliverer"
import { OnOrderReturned } from "./on-order-returned"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"

let ordersRepository: InMemoryOrdersRepository
let deliverersRepository: InMemoryDelivererRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy;

describe("On order returned", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    const onOrderReturned = new OnOrderReturned(deliverersRepository, sendNotificationUseCase)
  })

  it("should send a notification when an order is returned", async () => {
    const recipient = makeRecipient()

    const deliverer = makeDeliverer()
    await deliverersRepository.create(deliverer)

    const order = makeOrder({ recipientId: recipient.id, status: OrderStatus.DELIVERED, delivererId: deliverer.id })
    await ordersRepository.items.push(order)

    order.setAsReturned()

    await ordersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith({
        content: `The order "${order.pickupCode}" that you picked up has been returned`,
        recipientId: deliverer.id.toString(),
        title: "An order has been returned"
      })
    })
  })
})