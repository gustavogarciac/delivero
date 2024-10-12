import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { OrderCreatedEvent } from "@/domain/logistics/enterprise/events/order-created-event";
import { SendNotificationUseCase } from "../application/use-cases/send-notification";

export class OnOrderCreated implements EventHandler {
  constructor(
    private recipiensRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewOrderNotification.bind(this), OrderCreatedEvent.name)
  }

  private async sendNewOrderNotification({ order }: OrderCreatedEvent) {
    const recipient = await this.recipiensRepository.findById(order.recipientId.toString())

    if(recipient) {
      await this.sendNotification.execute({
        content: `New order created with tracking code: ${order.trackingNumber}`,
        recipientId: recipient.id.toString(),
        title: "New order created"
      })
    }

  }
}