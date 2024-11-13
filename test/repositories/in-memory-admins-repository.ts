import { PaginationParams } from "@/core/repositories/pagination";
import { AdminsRepository } from "@/domain/logistics/application/repositories/admins-repository";
import { DeliverersRepository } from "@/domain/logistics/application/repositories/deliverers-repository";
import { Admin } from "@/domain/logistics/enterprise/entities/admin";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Status } from "@/domain/logistics/enterprise/entities/user";

export class InMemoryAdminsRepository implements AdminsRepository {
  constructor(private deliverersRepository: DeliverersRepository) {}
  public items: Admin[] = []

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.email === email)

    if (!admin) return null

    return admin
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.id.toString() === id)

    if (!admin) return null

    return admin
  }

  async setDelivererAsActive(delivererId: string): Promise<void> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return

    deliverer.status = Status.ACTIVE

    this.deliverersRepository.save(deliverer)
  }

  async attendOrderToDeliverer(order: Order, delivererId: string): Promise<void> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return

    deliverer.attendOrder(order)

    this.deliverersRepository.save
  }

  // async findByEmail(email: string): Promise<Admin | null> {
  //   const admin = this.items.find((admin) => admin.email === email)

  //   if(!admin) return null

  //   return admin
  // }

  // async findMany(params: PaginationParams): Promise<{ items: Admin[]; total?: number }> {
  //   const { page = 1, perPage = 10, count = false, query } = params;

  //   let paginatedItems = this.items.slice((page - 1) * perPage, page * perPage);
  
  //   if (query) {
  //     paginatedItems = paginatedItems.filter((item) =>
  //       item.name.toLowerCase().includes(query.toLowerCase())
  //     );
  //   }
  
  //   if (count) {
  //     return { items: paginatedItems, total: paginatedItems.length };
  //   }
  
  //   return { items: paginatedItems };
  // }

  async create(admin: Admin): Promise<void> {
    this.items.push(admin)
  }

  // async delete(admin: Admin): Promise<void> {
  //   const index = this.items.findIndex((item) => item.id === admin.id)

  //   this.items.splice(index, 1)
  // }

  // async save(admin: Admin): Promise<void> {
  //   const index = this.items.findIndex((item) => item.id === admin.id)

  //   this.items.splice(index, 1, admin)

  //   this.items = [...this.items, admin]
  // }
}