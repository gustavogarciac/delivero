import { PaginationParams } from "@/core/repositories/pagination";
import { RecipientsRepository } from "@/domain/logistics/application/repositories/recipients-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { PrismaService } from "../prisma.service";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { Injectable } from "@nestjs/common";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(params: PaginationParams): Promise<{ items: Recipient[]; total?: number; }> {
    const { page, perPage, count, query } = params

    let recipients: Recipient[] = []

    if(query) {
      const prismaRecipients = await this.prisma.recipient.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive"
          }
        },
        take: perPage,
        skip: (page - 1) * perPage,
        include: {
          orders: true
        }
      })

      recipients = prismaRecipients.map(PrismaRecipientMapper.toDomain)
    } else {
      const prismaRecipients = await this.prisma.recipient.findMany({
        take: perPage,
        skip: (page - 1) * perPage,
        include: {
          orders: true
        }
      })

      recipients = prismaRecipients.map(PrismaRecipientMapper.toDomain)
    }

    return {
      items: recipients,
      total: count ? recipients.length : undefined
    }
  }
  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findFirst({
      where: {
        email
      },
    })

    if(!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
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
  async fetchOrders(params: PaginationParams, recipientId: string): Promise<{ items: Order[]; total?: number; }> {
    const { page, perPage, count } = params

    const orders = await this.prisma.order.findMany({
      where: {
        recipientId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return {
      items: orders.map(PrismaOrderMapper.toDomain),
      total: count ? await this.prisma.order.count({
        where: {
          recipientId
        }
      }) : undefined
    }
  }
  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipient.id.toString()
      }
    })
  }
  async create(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.create({
      data: {
        address: recipient.address,
        city: recipient.city,
        country: recipient.country,
        email: recipient.email,
        name: recipient.name,
        password: recipient.password,
        phone: recipient.phone,
        state: recipient.state,
        zip: recipient.zip
      }
    })
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