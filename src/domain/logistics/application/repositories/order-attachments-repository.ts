import { OrderAttachment } from "../../enterprise/entities/order-attachment";

export abstract class OrderAttachmentsRepository {
  abstract create(orderAttachment: OrderAttachment): Promise<void>
  abstract findByOrderDelivererId(orderId: string, delivererId: string): Promise<OrderAttachment | null>
}