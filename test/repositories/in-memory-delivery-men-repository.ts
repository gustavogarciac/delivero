import { PaginationParams } from "@/core/repositories/pagination";
import { DeliveryMenRepository } from "@/domain/logistics/application/repositories/delivery-man-repository";
import { DeliveryMan } from "@/domain/logistics/enterprise/entities/delivery-man";

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryMan[] = []
  
  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((deliveryMan) => deliveryMan.cpf.value === cpf)

    if(!deliveryMan) return null

    return deliveryMan
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = this.items.find((deliveryMan) => deliveryMan.id.toString() === id)

    if (!deliveryMan) return null

    return deliveryMan
  }

  async findMany(params: PaginationParams): Promise<{ items: DeliveryMan[]; total?: number }> {
    const { page = 1, perPage = 10, count = false, query } = params;

    let paginatedItems = this.items.slice((page - 1) * perPage, page * perPage);
  
    if (query) {
      paginatedItems = paginatedItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    if (count) {
      return { items: paginatedItems, total: paginatedItems.length };
    }
  
    return { items: paginatedItems };
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    this.items.push(deliveryMan)
  }

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    const index = this.items.findIndex((item) => item.id === deliveryMan.id)

    this.items.splice(index, 1)
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const index = this.items.findIndex((item) => item.id === deliveryMan.id)

    this.items.splice(index, 1, deliveryMan)

    this.items = [...this.items, deliveryMan]
  }
}