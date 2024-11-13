import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { Order, Recipient as PrismaRecipient, Role } from "@prisma/client";
import { PrismaOrderMapper } from "./prisma-order-mapper";

type PrismaRecipientWithRelations = PrismaRecipient & {
  orders?: Order[]
}

export class PrismaRecipientMapper {
  static toDomain(prismaRecipient: PrismaRecipientWithRelations): Recipient {
    const recipient = Recipient.create({
      address: prismaRecipient.address,
      city: prismaRecipient.city,
      country: prismaRecipient.country,
      email: prismaRecipient.email,
      name: prismaRecipient.name,
      phone: prismaRecipient.phone,
      state: prismaRecipient.state,
      zip: prismaRecipient.zip,
      createdAt: prismaRecipient.createdAt,
      lastOrderAt: prismaRecipient.lastOrderAt,
      updatedAt: prismaRecipient.updatedAt,
      password: prismaRecipient.password,
      orders: prismaRecipient.orders ? prismaRecipient.orders.map(PrismaOrderMapper.toDomain) : [],
    },
      new UniqueEntityId(prismaRecipient.id)
    )

    return recipient
  }

  static toPersistence(recipient: Recipient): PrismaRecipient {
    return {
      address: recipient.address,
      city: recipient.city,
      country: recipient.country,
      email: recipient.email,
      name: recipient.name,
      phone: recipient.phone,
      state: recipient.state,
      zip: recipient.zip,
      createdAt: recipient.createdAt!,
      lastOrderAt: recipient.lastOrderAt,
      updatedAt: recipient.updatedAt!,
      password: recipient.password,
      id: recipient.id.toString(),
      role: Role.RECIPIENT
    }
  }
}