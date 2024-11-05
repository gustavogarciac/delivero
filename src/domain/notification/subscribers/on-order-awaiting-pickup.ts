import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../application/use-cases/send-notification";
import { DeliverersRepository } from "@/domain/logistics/application/repositories/deliverers-repository";
import { OrderAwaitingPickup } from "@/domain/logistics/enterprise/events/order-awaiting-pickup";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnOrderAwaitingPickup implements EventHandler {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendOrderAwaitingPickupNotification.bind(this), OrderAwaitingPickup.name)
  }

  private async sendOrderAwaitingPickupNotification({ order }: OrderAwaitingPickup) {
    if(!order.delivererId) return

    const deliverer = await this.deliverersRepository.findById(order.delivererId.toString())
    
    if(deliverer) {
      await this.sendNotification.execute({
        content: `The order with pickup code: ${order.pickupCode} is awaiting pickup`,
        recipientId: deliverer.id.toString(),
        title: "Order awaiting pickup"
      })
    }
  }
}