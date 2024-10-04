import { DelivererToken } from "../../enterprise/entities/delivererTokens";

export abstract class DelivererTokenRepository {
  abstract save(delivererId: string, token: string, expiration: Date): Promise<void>
  abstract findByDelivererIdAndToken(delivererId: string, token: string): Promise<DelivererToken | null>
}