import { DelivererToken } from "@/domain/logistics/enterprise/entities/delivererTokens";
import { Prisma, DelivererToken as PrismaDelivererToken } from "@prisma/client";


export class PrismaDelivererTokenMapper {
  static toDomain(prismaDelivererToken: PrismaDelivererToken): DelivererToken {
    const delivererToken = DelivererToken.create({
      delivererId: prismaDelivererToken.delivererId,
      token: prismaDelivererToken.token,
      expiration: prismaDelivererToken.expiresAt,
    })

    return delivererToken
  }

  static toPersistence(delivererToken: DelivererToken): Prisma.DelivererTokenUncheckedCreateInput {
    return {
      delivererId: delivererToken.delivererId,
      expiresAt: delivererToken.expiration,
      token: delivererToken.token,
    }
  }
  
}