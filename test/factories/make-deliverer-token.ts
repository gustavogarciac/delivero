import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DelivererProps } from "@/domain/logistics/enterprise/entities/deliverer";
import { UserProps } from "@/domain/logistics/enterprise/entities/user";
import { Vehicle } from "@/domain/logistics/enterprise/entities/vehicle";
import { faker } from "@faker-js/faker";
import { makeVehicle } from "./make-vehicle";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaDelivererMapper } from "@/infra/database/prisma/mappers/prisma-deliverer-mapper";
import { DelivererToken, DelivererTokenProps } from "@/domain/logistics/enterprise/entities/delivererTokens";
import { makeDeliverer } from "./make-deliverer";
import { PrismaDelivererTokenMapper } from "@/infra/database/prisma/mappers/prisma-deliverer-token-mapper";

export function makeDelivererToken(
  override: Partial<DelivererTokenProps> = {},
  id?: UniqueEntityId
) {
  /* 
  * This function creates a Deliverer entity with the given properties.
  * If no properties are given, random values will be generated.
  */
  const delivererToken = DelivererToken.create(
    {
      delivererId: faker.string.uuid(),
      expiration: faker.date.future(),
      token: faker.string.uuid(),
      ...override
    },
    id
  )

  return delivererToken
}

@Injectable()
export class DelivererTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivererToken(data: Partial<DelivererTokenProps> = {}) {
    const delivererToken = makeDelivererToken(data)

    await this.prisma.delivererToken.create({
      data: PrismaDelivererTokenMapper.toPersistence(delivererToken)
    })

    return delivererToken
  }
}