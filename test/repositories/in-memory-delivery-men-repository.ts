import { DeliveryMenRepository } from "@/domain/logistics/application/repositories/delivery-man-repository";
import { DeliveryMan } from "@/domain/logistics/enterprise/entities/delivery-man";

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryMan[] = []
  
  async findByEmail(email: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((deliveryMan) => deliveryMan.email === email)

    if(!deliveryMan) return null

    return deliveryMan
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((deliveryMan) => deliveryMan.id.toString() === id)

    if (!deliveryMan) return null

    return deliveryMan
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    this.items.push(deliveryMan)
  }

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    const index = this.items.findIndex((item) => item.id === deliveryMan.id)

    this.items.splice(index, 1)
  }
}