import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { FactoriesModule } from "@/infra/factories/factories.module"
import { MailerModule } from "@/infra/mailer/mailer.module"
import { MailService } from "@/infra/mailer/nodemailer"
import { EnvService } from "@/infra/env/env.service"
import { EnvModule } from "@/infra/env/env.module"

describe("Reset Deliverer Password (e2e)", () => {
  let app: INestApplication
  let delivererFactory: DelivererFactory
  let mailer: MailService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule, MailerModule, EnvModule],
      providers: [DelivererFactory, MailService]
    }).compile()

    app = moduleRef.createNestApplication()

    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    mailer = moduleRef.get<MailService>(MailService)

    await app.init()
  })

  test("[POST] /sessions/deliverers/reset-password", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
  
    const response = await request(app.getHttpServer()).post(`/sessions/deliverers/reset-password`).send({
      email: deliverer.email
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual(expect.objectContaining({
      otp: expect.any(String),
      sentEmail: true
    }))
  })
})