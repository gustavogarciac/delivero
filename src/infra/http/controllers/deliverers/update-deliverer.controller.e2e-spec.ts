import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { FactoriesModule } from "@/infra/factories/factories.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Update Deliverer (e2e)", () => {
  let app: INestApplication
  let delivererFactory: DelivererFactory
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [DelivererFactory, PrismaService]
    }).compile()

    app = moduleRef.createNestApplication()

    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    prismaService = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test("[POST] /sessions/deliverers/reset-password", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
  
    const response = await request(app.getHttpServer()).put(`/deliverers/${deliverer.id.toString()}`).send({
      email: "updated-email@email.com",
      name: "updated name",
      password: "updated-password",
      phone: "5199999942",
    })

    expect(response.statusCode).toBe(204)

    const updatedDeliverer = await prismaService.deliverer.findUnique({
      where: {
        id: deliverer.id.toString()
      }
    })

    expect(updatedDeliverer).toEqual(expect.objectContaining({
      email: "updated-email@email.com",
      name: "updated name",
      phone: "5199999942",
    }))
  })
})