import { RecipientTokenRepository } from "@/domain/logistics/application/repositories/recipient-tokens-repository"
import { RecipientToken } from "@/domain/logistics/enterprise/entities/recipientTokens"

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

  async findByRecipientIdAndToken(recipientId: string, token: string): Promise<RecipientToken | null> {
    const recipientToken = await this.items.find((item) => item.recipientId === recipientId && item.token === token)

    if(!recipientToken) return null

    return recipientToken
  }
}