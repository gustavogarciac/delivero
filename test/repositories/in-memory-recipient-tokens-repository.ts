import { RecipientTokenRepository } from "@/domain/logistics/application/repositories/recipient-tokens-repository"
import { RecipientToken } from "@/domain/logistics/enterprise/entities/recipientToken"

export class InMemoryRecipientTokenRepository implements RecipientTokenRepository {
  items: RecipientToken[] = []

  async save(recipientId: string, token: string, expiration: Date): Promise<void> {
    const recipientToken = RecipientToken.create({
      recipientId,
      token,
      expiration
    })

    this.items.push(recipientToken)
  }
}