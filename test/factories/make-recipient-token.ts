import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { RecipientToken, RecipientTokenProps } from "@/domain/logistics/enterprise/entities/recipientTokens";
import { PrismaRecipientTokenMapper } from "@/infra/database/prisma/mappers/prisma-recipient-token-mapper";

export function makeRecipientToken(
  override: Partial<RecipientTokenProps> = {},
) {
  /* 
  * This function creates a Recipient entity with the given properties.
  * If no properties are given, random values will be generated.
  */
  const recipientToken = RecipientToken.create(
    {
      recipientId: faker.string.uuid(),
      expiration: faker.date.future(),
      token: faker.string.uuid(),
      ...override
    },
  )

  return recipientToken
}

@Injectable()
export class RecipientTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipientToken(data: Partial<RecipientTokenProps> = {}) {
    const recipientToken = makeRecipientToken(data)

    await this.prisma.recipientToken.create({
      data: PrismaRecipientTokenMapper.toPersistence(recipientToken)
    })

    return recipientToken
  }
}