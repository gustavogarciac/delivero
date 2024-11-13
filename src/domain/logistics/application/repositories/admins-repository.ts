import { PaginationParams } from "@/core/repositories/pagination";
import { Admin } from "../../enterprise/entities/admin";
import { Order } from "../../enterprise/entities/order";

export abstract class AdminsRepository {
  abstract findById(id: string): Promise<Admin | null>
  // abstract findMany(params: PaginationParams): Promise<{ items: Admin[]; total?: number }>
  abstract findByEmail(email: string): Promise<Admin | null>
  abstract create(admin: Admin): Promise<void>
  abstract setDelivererAsActive(delivererId: string): Promise<void>
  abstract attendOrderToDeliverer(order: Order, delivererId: string): Promise<void>
  // abstract delete(admin: Admin): Promise<void>
  // abstract save(admin: Admin): Promise<void>
}