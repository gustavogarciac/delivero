import { INestApplication } from "@nestjs/common"
import { AdminFactory } from "test/factories/make-admin"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("Register Admin Controller (e2e)", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, PrismaService]
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test("[POST] /admins", async () => {
    const response = await request(app.getHttpServer())
      .post("/admins")
      .send({
        cpf: "130.752.220-38",
        email: "johndoe@example.com",
        name: "John Doe",
        password: "123456789",
        phone: "519999942"
      })


    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      adminId: expect.any(String),
    })
  })
})