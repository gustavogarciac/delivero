import { OrderAttachmentsRepository } from "@/domain/logistics/application/repositories/order-attachments-repository"
import { OrderAttachment } from "@/domain/logistics/enterprise/entities/order-attachment"

export class InMemoryOrderAttachmentsRepository implements OrderAttachmentsRepository {
  items: OrderAttachment[] = []

  async create(orderAttachment: OrderAttachment): Promise<void> {
    this.items.push(orderAttachment)
  }

  async findByOrderDelivererId(orderId: string, delivererId: string): Promise<OrderAttachment | null> {
    return this.items.find((item) => item.delivererId === delivererId && item.orderId === orderId) ?? null
  }
}