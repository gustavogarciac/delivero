import { PaginationParams } from "@/core/repositories/pagination";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async delete(recipient: Recipient): Promise<void> {
    const index = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(index, 1)
  }

  async findMany(params: PaginationParams): Promise<{ items: Recipient[]; total?: number }> {
    const { page, perPage, count, query } = params
  
    const filteredItems = query
      ? this.items.filter((recipient) => recipient.name.includes(query))
      : this.items
  
    const paginatedItems = filteredItems.slice((page - 1) * perPage, page * perPage)
  
    return count
      ? { items: paginatedItems, total: filteredItems.length }
      : { items: paginatedItems }
  }
  
  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = this.items.find((recipient) => recipient.email === email)

    if (!recipient) return null

    return recipient
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((recipient) => recipient.id.toString() === id)

    if (!recipient) return null

    return recipient
  }
}