import { INestApplication } from "@nestjs/common"
import { OrderFactory } from "test/factories/make-order"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { AdminFactory } from "test/factories/make-admin"
import { JwtService } from "@nestjs/jwt"
import { RecipientFactory } from "test/factories/make-recipient"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Set Order as Available To Pick Up (e2e)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let prismaService: PrismaService

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderFactory, PrismaService]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get<AdminFactory>(AdminFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)
    prismaService = moduleRef.get<PrismaService>(PrismaService)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test("[PATCH] /orders/:orderId/available-to-pick-up", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({ recipientId: recipient.id, status: OrderStatus.PREPARING })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/available-to-pick-up`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const updatedOrder = await prismaService.order.findUnique({
      where: {
        id: order.id.toString()
      }
    })

    expect(updatedOrder?.status).toBe("AWAITING_PICKUP")
  })
})