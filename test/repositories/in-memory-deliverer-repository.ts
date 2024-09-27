import { PaginationParams } from "@/core/repositories/pagination";
import { DeliverersRepository } from "@/domain/logistics/application/repositories/deliverers-repository";
import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer";

export class InMemoryDelivererRepository implements DeliverersRepository {
  public items: Deliverer[] = []
  
  async findByCpf(cpf: string): Promise<Deliverer | null> {
    const deliverer = this.items.find((deliverer) => deliverer.cpf.value === cpf)

    if(!deliverer) return null

    return deliverer
  }

  async findById(id: string): Promise<Deliverer | null> {
    const deliverer = this.items.find((deliverer) => deliverer.id.toString() === id)

    if (!deliverer) return null

    return deliverer
  }

  async findByEmail(email: string): Promise<Deliverer | null> {
    const deliverer = this.items.find((deliverer) => deliverer.email === email)

    if(!deliverer) return null

    return deliverer
  }

  async findMany(params: PaginationParams): Promise<{ items: Deliverer[]; total?: number }> {
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

  async create(deliverer: Deliverer): Promise<void> {
    this.items.push(deliverer)
  }

  async delete(deliverer: Deliverer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === deliverer.id)

    this.items.splice(index, 1)
  }

  async save(deliverer: Deliverer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === deliverer.id)

    this.items.splice(index, 1, deliverer)

    this.items = [...this.items, deliverer]
  }
}