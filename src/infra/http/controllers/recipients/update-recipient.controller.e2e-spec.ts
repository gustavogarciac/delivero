import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { FactoriesModule } from "@/infra/factories/factories.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"

describe("Update Recipient (e2e)", () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let prismaService: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [RecipientFactory, PrismaService]
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    prismaService = moduleRef.get<PrismaService>(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[PUT] /recipients/:recipientId", async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: recipient.id.toString() })
  
    const response = await request(app.getHttpServer()).put(`/recipients/${recipient.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        address: "Updated address",
        city: "Updated City",
        country: "Updated Country",
        email: "update@email.com",
        name: "Updated Name",
        phone: "updated-phone",
        state: "updated-state",
        zip: "updated-zip",
      })

    expect(response.statusCode).toBe(204)

    const updatedRecipient = await prismaService.recipient.findUnique({
      where: {
        id: recipient.id.toString()
      }
    })

    expect(updatedRecipient).toEqual(expect.objectContaining({
      email: "update@email.com",
    }))
  })
})