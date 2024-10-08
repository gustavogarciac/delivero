import { Order } from "@/domain/logistics/enterprise/entities/order";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === notification.id.toString())
  
    if (index !== -1) {
      this.items[index] = notification;
    } else {
      this.items.push(notification);
    }
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((notification) => notification.id.toString() === id)

    if (!notification) return null

    return notification
  }
}