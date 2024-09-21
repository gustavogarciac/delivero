import { DeliveryMan } from "../../enterprise/entities/delivery-man";

export abstract class DeliveryMenRepository {
  abstract findByEmail(email: string): Promise<DeliveryMan | null>
  abstract create(deliveryMan: DeliveryMan): Promise<void>
}