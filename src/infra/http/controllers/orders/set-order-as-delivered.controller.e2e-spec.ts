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
import { OrderAttachmentFactory } from "test/factories/make-order-attachment"
import { DelivererFactory } from "test/factories/make-deliverer"

describe("Set Order as Available To Pick Up (e2e)", () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let delivererFactory: DelivererFactory
  let orderAttachmentFactory: OrderAttachmentFactory
  let prismaService: PrismaService

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderFactory, PrismaService, OrderAttachmentFactory, DelivererFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get<AdminFactory>(AdminFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)
    prismaService = moduleRef.get<PrismaService>(PrismaService)
    orderAttachmentFactory = moduleRef.get<OrderAttachmentFactory>(OrderAttachmentFactory)
    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test("[PATCH] /orders/:orderId/delivered/:delivererId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()
    const deliverer = await delivererFactory.makePrismaDeliverer({ deliveriesCount: 0})
    const order = await orderFactory.makePrismaOrder({ 
      recipientId: recipient.id, 
      status: OrderStatus.IN_TRANSIT,
      delivererId: deliverer.id
    })
    await orderAttachmentFactory.makePrismaOrderAttachment(
      {
        delivererId: deliverer.id.toString(),
        orderId: order.id.toString()
      },
    )

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/delivered/${deliverer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const updatedOrder = await prismaService.order.findUnique({
      where: {
        id: order.id.toString()
      }
    })

    expect(updatedOrder?.status).toBe("DELIVERED")

    const updatedDeliverer = await prismaService.deliverer.findUnique({
      where: {
        id: deliverer.id.toString()
      },
      include: {
        orders: true
      }
    })

    expect(updatedDeliverer?.deliveriesCount).toBe(1)
    expect(updatedDeliverer?.orders[0].status).toBe("DELIVERED")
  })
})