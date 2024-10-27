import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { JwtService } from "@nestjs/jwt"
import { OrderFactory } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"

describe("Get Recipients (e2e)", () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /recipients", async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const accessToken = jwt.sign({ sub: recipient.id.toString() })

    for(let i = 1; i < 10; i++) {
      await recipientFactory.makePrismaRecipient()
    }

    const response = await request(app.getHttpServer())
      .get(`/recipients`)
      .set("Authorization", `Bearer ${accessToken}`)
      .query({
        page: 1,
        perPage: 10,
        count: true
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("recipients")
    expect(response.body).toHaveProperty("total")
    expect(response.body.recipients).toHaveLength(10)
    expect(response.body.total).toBe(10)
  })
})