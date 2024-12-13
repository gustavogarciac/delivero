import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { OrderFactory } from "test/factories/make-order"
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization"
import { RecipientFactory } from "test/factories/make-recipient"
import { FactoriesModule } from "@/infra/factories/factories.module"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { JwtService } from "@nestjs/jwt"

describe("Get Deliverer Profile (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let delivererFactory: DelivererFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [DelivererFactory, OrderFactory, RecipientFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /deliverers/:delivererId/orders/near", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const recipient = await recipientFactory.makePrismaRecipient()
    const rightOrder = await orderFactory.makePrismaOrder({ delivererId: deliverer.id, geo: Geolocalization.create({ latitude: -23.5505199, longitude: -46.63330939999999 }), recipientId: recipient.id, status: OrderStatus.AWAITING_PICKUP })
    await orderFactory.makePrismaOrder({ delivererId: deliverer.id, geo: Geolocalization.create({ latitude: -23.5505199, longitude: -46.63330939999999 }), recipientId: recipient.id, status: OrderStatus.PREPARING })
    await orderFactory.makePrismaOrder({ delivererId: deliverer.id, geo: Geolocalization.create({ latitude: -21.2201923, longitude: -33.23123123123123 }), recipientId: recipient.id, status: OrderStatus.AWAITING_PICKUP })

    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    const response = await request(app.getHttpServer())
    .get(`/deliverers/${deliverer.id.toString()}/orders/near`)
    .set("Authorization", `Bearer ${accessToken}`)
    .query({
      latitude: -23.5505199,
      longitude: -46.63330939999999,
      maxDistance: 1000
    })

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          id: rightOrder.id.toString()
        })
      ])
    })
  })
})