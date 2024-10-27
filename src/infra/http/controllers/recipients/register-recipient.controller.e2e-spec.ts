import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { JwtService } from "@nestjs/jwt"
import { OrderFactory } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"

describe("Register Recipient (e2e)", () => {
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

  test("[POST] /recipients", async () => {
    const response = await request(app.getHttpServer())
      .post(`/recipients`)
      .send({
        address: "Rua dos Bobos, 0",
        city: "São Paulo",
        country: "Brasil",
        email: "john@email.com",
        name: "John Doe",
        password: "123456789",
        phone: "19521312323",
        state: "São Paulo",
        zip: "12345678"
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      recipientId: expect.any(String)
    })
  })
})