import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Order } from "../entities/order";

export class OrderReturnedEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order

  constructor(order: Order) {
    this.ocurredAt = new Date()
    this.order = order
  }

  public getAggregateId(): UniqueEntityId {
    return this.order.id;
  }
}