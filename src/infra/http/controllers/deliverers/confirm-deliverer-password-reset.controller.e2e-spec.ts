import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { DelivererTokenFactory } from "test/factories/make-deliverer-token"

describe("Confirm Deliverer Password Reset (e2e)", () => {
  let app: INestApplication
  let delivererFactory: DelivererFactory
  let delivererTokenFactory: DelivererTokenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DelivererFactory, DelivererTokenFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    delivererTokenFactory = moduleRef.get<DelivererTokenFactory>(DelivererTokenFactory)

    await app.init()
  })

  test("[POST] /sessions/deliverers/confirm-password-reset", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    await delivererTokenFactory.makePrismaDelivererToken({
      delivererId: deliverer.id.toString(),
      expiration: new Date(Date.now() + 1000 * 60 * 60),
      token: "valid_token"
    })

    const response = await request(app.getHttpServer()).post("/sessions/deliverers/confirm-password-reset").send({
      delivererId: deliverer.id.toString(),
      newPassword: "new_password",
      token: "valid_token"
    })

    expect(response.statusCode).toBe(204)
  })
})