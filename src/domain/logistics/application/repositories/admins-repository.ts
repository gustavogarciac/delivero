import { PaginationParams } from "@/core/repositories/pagination";
import { Admin } from "../../enterprise/entities/admin";

export abstract class AdminsRepository {
  abstract findByCpf(cpf: string): Promise<Admin | null>
  abstract findById(id: string): Promise<Admin | null>
  // abstract findMany(params: PaginationParams): Promise<{ items: Admin[]; total?: number }>
  // abstract findByEmail(email: string): Promise<Admin | null>
  abstract create(admin: Admin): Promise<void>
  abstract setDelivererAsActive(delivererId: string): Promise<void>
  // abstract delete(admin: Admin): Promise<void>
  // abstract save(admin: Admin): Promise<void>
}