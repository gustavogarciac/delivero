import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { SendNotificationUseCase } from "../application/use-cases/send-notification";
import { OrderPickedUpEvent } from "@/domain/logistics/enterprise/events/order-picked-up-event";

export class OnOrderPickedUp implements EventHandler {
  constructor(
    private recipiensRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendOrderPickedUpNotification.bind(this), OrderPickedUpEvent.name)
  }

  private async sendOrderPickedUpNotification({ order }: OrderPickedUpEvent) {
    const recipient = await this.recipiensRepository.findById(order.recipientId.toString())

    if(recipient) {
      await this.sendNotification.execute({
        content: `Your order with tracking code: ${order.trackingNumber} has been picked up by a deliverer and is on its way to you`,
        recipientId: recipient.id.toString(),
        title: "Your order has been picked up"
      })
    }

  }
}