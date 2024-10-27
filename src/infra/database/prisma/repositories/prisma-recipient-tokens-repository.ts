import { RecipientTokenRepository } from "@/domain/logistics/application/repositories/recipient-tokens-repository";
import { RecipientToken } from "@/domain/logistics/enterprise/entities/recipientTokens";
import { PrismaService } from "../prisma.service";
import { PrismaRecipientTokenMapper } from "../mappers/prisma-recipient-token-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaRecipientTokensRepository implements RecipientTokenRepository {
  constructor(private prisma: PrismaService) {}

  async save(recipientId: string, token: string, expiration: Date): Promise<void> {
    await this.prisma.recipientToken.create({
      data: {
        recipientId,
        token,
        expiresAt: expiration
      }
    })
  }
  
  async findByRecipientIdAndToken(recipientId: string, token: string): Promise<RecipientToken | null> {
    const recipientToken = await this.prisma.recipientToken.findFirst({
      where: {
        recipientId,
        token
      }
    })

    if(!recipientToken) {
      return null
    }
    
    return PrismaRecipientTokenMapper.toDomain(recipientToken)
  }
}