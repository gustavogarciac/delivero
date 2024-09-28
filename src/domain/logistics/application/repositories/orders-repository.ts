import { Order } from "../../enterprise/entities/order";

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract setAsPickedUp(id: string): Promise<void>
}