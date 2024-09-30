import { Recipient } from "../../enterprise/entities/recipient";

export abstract class RecipientsRepository {
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
  abstract delete(recipient: Recipient): Promise<void>
  abstract create(recipient: Recipient): Promise<void>
}