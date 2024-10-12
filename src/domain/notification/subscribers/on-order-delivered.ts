import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { SendNotificationUseCase } from "../application/use-cases/send-notification";
import { OrderDeliveredEvent } from "@/domain/logistics/enterprise/events/order-delivered-event";

export class OnOrderDelivered implements EventHandler {
  constructor(
    private recipiensRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendOrderDeliveredNotification.bind(this), OrderDeliveredEvent.name)
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    const recipient = await this.recipiensRepository.findById(order.recipientId.toString())

    if(recipient) {
      await this.sendNotification.execute({
        content: `Your order with tracking code: ${order.trackingNumber} has been delivered`,
        recipientId: recipient.id.toString(),
        title: "Your order has been delivered"
      })
    }

  }
}