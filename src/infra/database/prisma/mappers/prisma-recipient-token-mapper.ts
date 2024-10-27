import { RecipientToken } from "@/domain/logistics/enterprise/entities/recipientTokens";
import { Prisma, RecipientToken as PrismaRecipientToken } from "@prisma/client";


export class PrismaRecipientTokenMapper {
  static toDomain(prismaRecipientToken: PrismaRecipientToken): RecipientToken {
    const recipientToken = RecipientToken.create({
      recipientId: prismaRecipientToken.recipientId,
      token: prismaRecipientToken.token,
      expiration: prismaRecipientToken.expiresAt,
    })

    return recipientToken
  }

  static toPersistence(recipientToken: RecipientToken): Prisma.RecipientTokenUncheckedCreateInput {
    return {
      recipientId: recipientToken.recipientId,
      expiresAt: recipientToken.expiration,
      token: recipientToken.token,
    }
  }
  
}