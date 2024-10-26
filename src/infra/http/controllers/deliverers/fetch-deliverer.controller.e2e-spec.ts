import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Fetch Deliverer (e2e)", () => {
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

  test("[GET] /deliverers", async () => {
    for (let i = 0; i < 20; i++) {
      await delivererFactory.makePrismaDeliverer()
    }

    const response = await request(app.getHttpServer()).get(`/deliverers?page=1&per_page=10`).send({})

    expect(response.statusCode).toBe(200)

    expect(response.body).toHaveProperty("deliverers")

    expect(response.body.deliverers).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String)
      })
    ]))

    await delivererFactory.makePrismaDeliverer({}, { name: "John Doe" })

    const secondResponse = await request(app.getHttpServer()).get(`/deliverers?page=1&per_page=10&query=Doe&count=true`).send({})

    expect(secondResponse.statusCode).toBe(200)

    expect(secondResponse.body).toHaveProperty("deliverers")

    expect(response.body.deliverers).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String)
      }),
    ]))

    expect(secondResponse.body.total).toBe(1)
  })
})