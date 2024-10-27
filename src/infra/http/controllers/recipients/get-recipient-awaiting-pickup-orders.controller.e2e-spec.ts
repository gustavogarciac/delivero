import { INestApplication } from "@nestjs/common"
import { RecipientFactory } from "test/factories/make-recipient"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"
import { OrderFactory } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"

describe("Get Recipient Awaiting Pickup Orders (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, OrderFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /recipients/:recipientId/orders/awaiting-pickup", async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const accessToken = jwt.sign({ sub: recipient.id.toString() })

    for (let i = 0; i < 9; i++) {
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: OrderStatus.AWAITING_PICKUP
      })
    }

    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      status: OrderStatus.DELIVERED
    })

    const response = await request(app.getHttpServer())
      .get(`/recipients/${recipient.id.toString()}/orders/awaiting-pickup`)
      .set("Authorization", `Bearer ${accessToken}`)
      .query({
        page: 1,
        perPage: 10,
        count: true
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("orders")
    expect(response.body).toHaveProperty("total")
    expect(response.body.orders).toHaveLength(9)
    expect(response.body.total).toBe(9)
  })
})