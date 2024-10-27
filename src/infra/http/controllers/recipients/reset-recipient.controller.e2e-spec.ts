import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { FactoriesModule } from "@/infra/factories/factories.module"
import { JwtService } from "@nestjs/jwt"

describe("Reset Recipient Password (e2e)", () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[POST] /sessions/recipients/reset-password", async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const accessToken = jwt.sign({ sub: recipient.id.toString() })
  
    const response = await request(app.getHttpServer())
      .post(`/sessions/recipients/reset-password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: recipient.email
      })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual(expect.objectContaining({
      otp: expect.any(String),
    }))
  })
})