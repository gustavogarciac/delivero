export abstract class DelivererTokensRepository {
  abstract save(delivererId: string, token: string, expiration: Date): Promise<void>
}