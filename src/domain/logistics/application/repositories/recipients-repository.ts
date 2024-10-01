import { PaginationParams } from "@/core/repositories/pagination";
import { Recipient } from "../../enterprise/entities/recipient";
import { Order } from "../../enterprise/entities/order";

export abstract class RecipientsRepository {
  abstract findMany(params: PaginationParams): Promise<{ items: Recipient[], total?: number }>
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
  abstract fetchOrders(params: PaginationParams, recipientId: string): Promise<{ items: Order[], total?: number }>
  abstract delete(recipient: Recipient): Promise<void>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
}