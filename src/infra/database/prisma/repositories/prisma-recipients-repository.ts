import { PaginationParams } from "@/core/repositories/pagination";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { PrismaService } from "../prisma.service";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  findMany(params: PaginationParams): Promise<{ items: Recipient[]; total?: number; }> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<Recipient | null> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id
      },
      include: {
        orders: true
      }
    })

    if(!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }
  fetchOrders(params: PaginationParams, recipientId: string): Promise<{ items: Order[]; total?: number; }> {
    throw new Error("Method not implemented.");
  }
  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipient.id.toString()
      }
    })
  }
  create(recipient: Recipient): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async save(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.update({
      where: {
        id: recipient.id.toString()
      },
      data: PrismaRecipientMapper.toPersistence(recipient)
    })
  }

}