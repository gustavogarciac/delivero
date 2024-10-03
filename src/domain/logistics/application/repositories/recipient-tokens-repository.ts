export abstract class RecipientTokensRepository {
  abstract save(recipientId: string, token: string, expiration: Date): Promise<void>
}