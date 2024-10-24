import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { Recipient, RecipientProps } from "@/domain/logistics/enterprise/entities/recipient";
import { faker } from "@faker-js/faker";
import { makeOrder } from "./make-order";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper";

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId
) {
  let numberOfOrders = faker.number.int({ min: 0, max: 5 });
  let orders: Order[] = []
    
  for (let i = 0; i <= numberOfOrders; i++) {
    const order = makeOrder()

    orders.push(order)
  }

  const recipient = Recipient.create(
    {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      createdAt: new Date(),
      lastOrderAt: new Date(),
      updatedAt: new Date(),
      orders,
      password: faker.internet.password(),
      ...override
    },
    id
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(recipientProps: Partial<RecipientProps> = {}) {
    const recipient = makeRecipient(recipientProps)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPersistence(recipient)
    })

    return recipient
  }
}