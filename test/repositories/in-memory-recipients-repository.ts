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