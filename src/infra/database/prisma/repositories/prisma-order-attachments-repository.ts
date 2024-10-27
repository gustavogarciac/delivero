import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OrderAttachmentsRepository } from "@/domain/logistics/application/repositories/order-attachments-repository";
import { OrderAttachment } from "@/domain/logistics/enterprise/entities/order-attachment";
import { PrismaOrderAttachmentMapper } from "../mappers/prisma-order-attachment-mapper";

@Injectable()
export class PrismaOrderAttachmentsRepository implements OrderAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(orderAttachment: OrderAttachment): Promise<void> {
    await this.prisma.orderAttachment.create({
      data: PrismaOrderAttachmentMapper.toPersistence(orderAttachment)
    })
  }
  async findByOrderDelivererId(orderId: string, delivererId: string): Promise<OrderAttachment | null> {
    const orderAttachment = await this.prisma.orderAttachment.findFirst({
      where: {
        delivererId,
        orderId
      }
    })

    if(!orderAttachment) return null

    return PrismaOrderAttachmentMapper.toDomain(orderAttachment)
  }
}