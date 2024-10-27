import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AttachmentType } from "@/domain/logistics/enterprise/entities/attachment";
import { OrderAttachment } from "@/domain/logistics/enterprise/entities/order-attachment";
import { Role } from "@/domain/logistics/enterprise/entities/role";
import { Status } from "@/domain/logistics/enterprise/entities/user";
import { Cpf } from "@/domain/logistics/enterprise/entities/value-objects/cpf";
import { OrderAttachment as PrismaOrderAttachment, Prisma } from "@prisma/client";

export class PrismaOrderAttachmentMapper {
  static toDomain(prismaOrderAttachment: PrismaOrderAttachment): OrderAttachment {
    const orderAttachment = OrderAttachment.create(
      {
        delivererId: prismaOrderAttachment.delivererId,
        orderId: prismaOrderAttachment.orderId,
      },
      {
        title: prismaOrderAttachment.title,
        url: prismaOrderAttachment.url,
        type: AttachmentType[prismaOrderAttachment.type as keyof typeof AttachmentType],
        createdAt: prismaOrderAttachment.createdAt,
        updatedAt: prismaOrderAttachment.updatedAt,
      },
      new UniqueEntityId(prismaOrderAttachment.id)
    )

    return orderAttachment
  }

  static toPersistence(orderAttachment: OrderAttachment): Prisma.OrderAttachmentCreateInput {      
    return {
      order: {
        connect: {
          id: orderAttachment.orderId
        }
      },
      title: orderAttachment.title,
      url: orderAttachment.url,
      id: orderAttachment.id.toString(),
      createdAt: orderAttachment.createdAt,
      deliverer: {
        connect: {
          id: orderAttachment.delivererId
        }
     },
      updatedAt: orderAttachment.updatedAt,
      type: AttachmentType[orderAttachment.type as keyof typeof AttachmentType]
    }
  }
}