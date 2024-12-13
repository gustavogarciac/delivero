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

describe("List Deliverer Pending Orders (e2e)", () => {
  let app: INestApplication
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

    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)
    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /deliverers/:delivererId/orders/pending", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: deliverer.id.toString() })
    
    for(let i = 0; i < 10; i++) {
      await orderFactory.makePrismaOrder({
        delivererId: deliverer.id,
        recipientId: recipient.id,
        status: OrderStatus.IN_TRANSIT
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/deliverers/${deliverer.id.toString()}/orders/pending`)
      .set("Authorization", `Bearer ${accessToken}`)
      .query({
        page: 1,
        perPage: 10,
        count: true
      })

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          delivererId: deliverer.id.toString(),
          status: OrderStatus.IN_TRANSIT,
        })
      ]),
      total: 10
    })
  })
})