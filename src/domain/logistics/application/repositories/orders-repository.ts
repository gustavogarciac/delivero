import { Order } from "../../enterprise/entities/order";

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
}