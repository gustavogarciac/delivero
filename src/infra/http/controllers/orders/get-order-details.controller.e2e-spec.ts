import { INestApplication } from "@nestjs/common"
import { OrderFactory } from "test/factories/make-order"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"
import { JwtService } from "@nestjs/jwt"
import { RecipientFactory } from "test/factories/make-recipient"

describe("Get Order Details (e2e)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get<AdminFactory>(AdminFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test("[GET] /orders/:orderId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({ recipientId: recipient.id })

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)


    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order.id.toString()
      })
    })
  })
})