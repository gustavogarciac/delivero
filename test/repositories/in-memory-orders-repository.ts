import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }
}