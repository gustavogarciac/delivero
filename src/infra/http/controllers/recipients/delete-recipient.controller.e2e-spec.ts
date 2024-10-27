import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"

describe("Delete Recipient (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[DELETE] /recipients/:recipientId", async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const accessToken = jwt.sign({ sub: recipient.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/recipients/${recipient.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})

    expect(response.statusCode).toBe(204)

    const prismaRecipients = await prismaService.recipient.findMany()

    expect(prismaRecipients).toHaveLength(0)
  })
})