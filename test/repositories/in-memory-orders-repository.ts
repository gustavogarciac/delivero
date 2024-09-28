import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((order) => order.id.toString() === id)

    if (!order) return null

    return order
  }

  async setAsPickedUp(id: string): Promise<void> {
    const order = this.items.find((order) => order.id.toString() === id)

    if (!order) return

    order.setAsPickedUp()
  }
}