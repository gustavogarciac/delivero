import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { Recipient, RecipientProps } from "@/domain/logistics/enterprise/entities/recipient";
import { faker } from "@faker-js/faker";
import { makeOrder } from "./make-order";
import { Order } from "@/domain/logistics/enterprise/entities/order";

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