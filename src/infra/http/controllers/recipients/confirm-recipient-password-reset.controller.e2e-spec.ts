import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { RecipientTokenFactory } from "test/factories/make-recipient-token"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Confirm Recipient Password Reset (e2e)", () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let recipientTokenFactory: RecipientTokenFactory
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, RecipientTokenFactory, PrismaService]
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    recipientTokenFactory = moduleRef.get<RecipientTokenFactory>(RecipientTokenFactory)
    prismaService = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test("[POST] /sessions/recipients/confirm-password-reset", async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientToken = await recipientTokenFactory.makePrismaRecipientToken({
      recipientId: recipient.id.toString(),
      expiration: new Date(Date.now() + 1000 * 60 * 60),
      token: "valid_token"
    })

    const response = await request(app.getHttpServer())
      .post("/sessions/recipients/confirm-password-reset")
      .send({
        recipientId: recipient.id.toString(),
        newPassword: "new_password",
        token: "valid_token"
      })

    expect(response.statusCode).toBe(204)
  })
})