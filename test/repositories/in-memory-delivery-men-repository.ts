import { DeliveryMenRepository } from "@/domain/logistics/application/repositories/delivery-man-repository";
import { DeliveryMan } from "@/domain/logistics/enterprise/entities/delivery-man";

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryMan[] = []
  
  async findByEmail(email: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((deliveryMan) => deliveryMan.email === email)

    if(!deliveryMan) return null

    return deliveryMan
  }
  async create(deliveryMan: DeliveryMan): Promise<void> {
    console.log(deliveryMan)

    this.items.push(deliveryMan)
  }
}