import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DeliveryMan, DeliveryManProps } from "@/domain/logistics/enterprise/entities/delivery-man";
import { Cpf } from "@/domain/logistics/enterprise/entities/value-objects/cpf";
import { faker } from "@faker-js/faker"

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityId
) {
  const deliveryMan = DeliveryMan.create(
    {
      cpf: Cpf.create(),
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