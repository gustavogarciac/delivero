import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../application/use-cases/send-notification";
import { DeliverersRepository } from "@/domain/logistics/application/repositories/deliverers-repository";
import { OrderAwaitingPickup } from "@/domain/logistics/enterprise/events/order-awaiting-pickup";
import { OrderReturnedEvent } from "@/domain/logistics/enterprise/events/order-returned-event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendOrderReturnedNotification.bind(this), OrderReturnedEvent.name)
  }

  private async sendOrderReturnedNotification({ order }: OrderReturnedEvent) {
    if(!order.delivererId) return

    const deliverer = await this.deliverersRepository.findById(order.delivererId.toString())
    
    if(deliverer) {
      await this.sendNotification.execute({
        content: `The order "${order.pickupCode}" that you picked up has been returned`,
        recipientId: deliverer.id.toString(),
        title: "An order has been returned"
      })
    }
  }
}