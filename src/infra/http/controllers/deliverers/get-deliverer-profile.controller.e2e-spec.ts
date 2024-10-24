import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Get Deliverer Profile (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let delivererFactory: DelivererFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DelivererFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)

    await app.init()
  })

  test("[GET] /deliverers/:delivererId", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()

    const response = await request(app.getHttpServer()).get(`/deliverers/${deliverer.id.toString()}`).send({})

    expect(response.statusCode).toBe(200)

    expect(response.body).toHaveProperty("deliverer")

    expect(response.body).toEqual({
      deliverer: expect.objectContaining({
        _id: deliverer.id,
      })
    })
  })
})