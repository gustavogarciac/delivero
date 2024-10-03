import { RecipientTokensRepository } from "@/domain/logistics/application/repositories/recipient-tokens-repository"
import { RecipientTokens } from "@/domain/logistics/enterprise/entities/recipientTokens"

export class InMemoryRecipientTokensRepository implements RecipientTokensRepository {
  items: RecipientTokens[] = []

  async save(recipientId: string, token: string, expiration: Date): Promise<void> {
    const recipientToken = RecipientTokens.create({
      recipientId,
      token,
      expiration
    })

    this.items.push(recipientToken)
  }
}