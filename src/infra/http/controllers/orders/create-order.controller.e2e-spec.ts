import { INestApplication } from "@nestjs/common"
import { OrderFactory } from "test/factories/make-order"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"
import { JwtService } from "@nestjs/jwt"
import { RecipientFactory } from "test/factories/make-recipient"

describe("Create Order Controller (e2e)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get<AdminFactory>(AdminFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test("[POST] /orders", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post("/orders")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        delivererId: undefined,
        recipientId: recipient.id.toString(),
        adminId: admin.id.toString(),
        deliveryAddress: "Rua dos Bobos, 0",
        latitude: -23.5489,
        longitude: -46.6388,
        notes: "Não é a casa amarela com a porta azul"
      })


    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      orderId: expect.any(String)
    })
  })
})