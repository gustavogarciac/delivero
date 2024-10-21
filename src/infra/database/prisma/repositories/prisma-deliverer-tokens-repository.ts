import { DelivererTokenRepository } from "@/domain/logistics/application/repositories/deliverer-tokens-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { DelivererToken } from "@/domain/logistics/enterprise/entities/delivererTokens";
import { PrismaDelivererTokenMapper } from "../mappers/prisma-deliverer-token-mapper";

@Injectable()
export class PrismaDelivererTokensRepository implements DelivererTokenRepository {
  constructor(private prisma: PrismaService) {}

  async save(delivererId: string, token: string, expiration: Date): Promise<void> {
    await this.prisma.delivererToken.create({
      data: {
        delivererId,
        token,
        expiresAt: expiration,
      }
    })
  }

  async findByDelivererIdAndToken(delivererId: string, token: string): Promise<DelivererToken | null> {
    const delivererToken = await this.prisma.delivererToken.findFirst({
      where: {
        delivererId,
        token,
      }
    })

    if(!delivererToken) {
      return null
    }

    return await PrismaDelivererTokenMapper.toDomain(delivererToken)
  }
}