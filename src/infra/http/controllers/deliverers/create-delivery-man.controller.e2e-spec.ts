import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Create Deliverer (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DelivererFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test("[POST] /deliverers", async () => {
    const response = await request(app.getHttpServer()).post("/deliverers").send({
      cpf: "207.831.244-49",
      name: "Jane Doe",
      password: "123456789",
      email: "jane@email.com",
      latitude: -40.1087,
      longitude: -57.0295,
      phone: "521323213"
    })

    const deliverer = await prismaService.deliverer.findFirst({
      where: {
        cpf: "207.831.244-49"
      }
    })

    expect(deliverer).toBeTruthy()

    expect(deliverer?.password).not.toBe("123456789")

    expect(response.statusCode).toBe(201)
  })
})