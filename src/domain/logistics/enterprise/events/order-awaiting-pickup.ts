import { DomainEvent } from "@/core/events/domain-event";
import { Order } from "../entities/order";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class OrderAwaitingPickup implements DomainEvent {
  public ocurredAt: Date;
  public order: Order

  constructor(order: Order) {
    this.ocurredAt = new Date()
    this.order = order
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id;
  }
}