import { DelivererTokenRepository } from "@/domain/logistics/application/repositories/deliverer-tokens-repository"
import { DelivererToken } from "@/domain/logistics/enterprise/entities/delivererTokens"

export class InMemoryDelivererTokenRepository implements DelivererTokenRepository {
  items: DelivererToken[] = []

  async save(delivererId: string, token: string, expiration: Date): Promise<void> {
    const delivererToken = DelivererToken.create({
      delivererId,
      token,
      expiration
    })

    this.items.push(delivererToken)
  }

  async findByDelivererIdAndToken(delivererId: string, token: string): Promise<DelivererToken | null> {
    const delivererToken = await this.items.find((item) => item.delivererId === delivererId && item.token === token)

    if(!delivererToken) return null

    return delivererToken
  }
}