import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"

describe("Get Deliverer Profile (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let delivererFactory: DelivererFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DelivererFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /deliverers/:delivererId", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const accessToken = jwt.sign({ sub: deliverer.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/deliverers/${deliverer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})

    expect(response.statusCode).toBe(200)

    expect(response.body).toHaveProperty("deliverer")

    expect(response.body).toEqual({
      deliverer: expect.objectContaining({
        id: deliverer.id.toString(),
      })
    })
  })
})