import { PaginationParams } from "@/core/repositories/pagination";
import { DeliveryMan } from "../../enterprise/entities/deliverer";

export abstract class DeliveryMenRepository {
  abstract findByCpf(cpf: string): Promise<DeliveryMan | null>
  abstract findById(id: string): Promise<DeliveryMan | null>
  abstract findMany(params: PaginationParams): Promise<{ items: DeliveryMan[]; total?: number }>
  abstract create(deliveryMan: DeliveryMan): Promise<void>
  abstract delete(deliveryMan: DeliveryMan): Promise<void>
  abstract save(deliveryMan: DeliveryMan): Promise<void>
}