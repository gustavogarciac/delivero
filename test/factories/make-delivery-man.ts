import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DeliveryMan, DeliveryManProps } from "@/domain/logistics/enterprise/entities/delivery-man";
import { faker } from "@faker-js/faker"

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId
) {
  const deliveryMan = DeliveryMan.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      ...override
    },
    id
  )

  return deliveryMan
}