import { PaginationParams } from "@/core/repositories/pagination";
import { Deliverer } from "../../enterprise/entities/deliverer";

export abstract class DeliverersRepository {
  abstract findByCpf(cpf: string): Promise<Deliverer | null>
  abstract findById(id: string): Promise<Deliverer | null>
  abstract findMany(params: PaginationParams): Promise<{ items: Deliverer[]; total?: number }>
  abstract findByEmail(email: string): Promise<Deliverer | null>
  abstract create(deliverer: Deliverer): Promise<void>
  abstract delete(deliverer: Deliverer): Promise<void>
  abstract save(deliverer: Deliverer): Promise<void>
}