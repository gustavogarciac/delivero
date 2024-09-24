import { DeliveryMan } from "../../enterprise/entities/delivery-man";

export abstract class DeliveryMenRepository {
  abstract findByEmail(email: string): Promise<DeliveryMan | null>
  abstract findById(id: string): Promise<DeliveryMan | null>
  abstract create(deliveryMan: DeliveryMan): Promise<void>
  abstract delete(deliveryMan: DeliveryMan): Promise<void>
}