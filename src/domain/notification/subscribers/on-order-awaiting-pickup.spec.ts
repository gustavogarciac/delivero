import { makeOrder } from "test/factories/make-order"
import { OnOrderCreated } from "./on-order-created"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { SendNotificationUseCase } from "../application/use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { waitFor } from "test/utils/wait-for"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { OnOrderAwaitingPickup } from "./on-order-awaiting-pickup"

let ordersRepository: InMemoryOrdersRepository
let deliverersRepository: InMemoryDelivererRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy;

describe("On order awaiting pickup", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")

    const onOrderAwaitingPickup = new OnOrderAwaitingPickup(deliverersRepository, sendNotificationUseCase)
  })

  it("should send a notification when an order is awaiting pickup", async () => {
    const deliverer = makeDeliverer()
    const order = makeOrder({ delivererId: deliverer.id, status: OrderStatus.PREPARING })

    await deliverersRepository.create(deliverer)
    await ordersRepository.items.push(order)

    order.setAsAwaitingPickup()

    await ordersRepository.save(order)
    await deliverersRepository.create(deliverer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith({
        content: `The order with pickup code: ${order.pickupCode} is awaiting pickup`,
        recipientId: deliverer.id.toString(),
        title: "Order awaiting pickup"
      })
    })
  })
})