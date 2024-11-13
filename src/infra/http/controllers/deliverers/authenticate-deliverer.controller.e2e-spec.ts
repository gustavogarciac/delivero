import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { hash } from "bcryptjs"

describe("Authenticate Deliverer (e2e)", () => {
  let app: INestApplication
  let delivererFactory: DelivererFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DelivererFactory, PrismaService]
    }).compile()

    app = moduleRef.createNestApplication()

    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)

    await app.init()
  })

  test("[POST] /sessions/deliverers", async () => {
    await delivererFactory.makePrismaDeliverer({}, { email: "testing@email.com", password: await hash("123456789", 8) })

    const response = await request(app.getHttpServer()).post("/sessions/deliverers").send({
      email: "testing@email.com",
      password: "123456789"
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})