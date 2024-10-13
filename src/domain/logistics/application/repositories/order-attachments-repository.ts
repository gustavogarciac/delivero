import { OrderAttachment } from "../../enterprise/entities/order-attachment";

export abstract class OrderAttachmentsRepository {
  abstract create(orderAttachment: OrderAttachment): Promise<void>
}