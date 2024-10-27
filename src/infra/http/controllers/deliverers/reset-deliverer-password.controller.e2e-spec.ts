import { INestApplication } from "@nestjs/common"
import { DelivererFactory } from "test/factories/make-deliverer"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { FactoriesModule } from "@/infra/factories/factories.module"
import { MailerModule } from "@/infra/mailer/mailer.module"
import { MailService } from "@/infra/mailer/nodemailer"
import { EnvModule } from "@/infra/env/env.module"
import { JwtService } from "@nestjs/jwt"
import { waitFor } from "test/utils/wait-for"

describe("Reset Deliverer Password (e2e)", () => {
  let app: INestApplication
  let delivererFactory: DelivererFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, FactoriesModule],
      providers: [DelivererFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[POST] /sessions/deliverers/reset-password", async () => {
    const deliverer = await delivererFactory.makePrismaDeliverer()
    const accessToken = jwt.sign({ sub: deliverer.id.toString() })
  
    const response = await request(app.getHttpServer())
      .post(`/sessions/deliverers/reset-password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        email: deliverer.email
      })

    await waitFor(() => {
      expect(response.statusCode).toBe(201)
    })

    await waitFor(() => {
      expect(response.body).toEqual(expect.objectContaining({
        otp: expect.any(String),
        sentEmail: true
      }))
    })
  })
})