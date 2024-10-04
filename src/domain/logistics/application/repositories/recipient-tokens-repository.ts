import { RecipientToken } from "../../enterprise/entities/recipientTokens";

export abstract class RecipientTokenRepository {
  abstract save(recipientId: string, token: string, expiration: Date): Promise<void>
  abstract findByRecipientIdAndToken(recipientId: string, token: string): Promise<RecipientToken>
}