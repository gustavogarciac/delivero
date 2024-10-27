import { INestApplication } from "@nestjs/common"
import { AdminFactory } from "test/factories/make-admin"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { JwtService } from "@nestjs/jwt"
import { DelivererFactory } from "test/factories/make-deliverer"
import { UserStatus } from "@prisma/client"
import { Status } from "@/domain/logistics/enterprise/entities/user"

describe("Set User As Active (e2e)", () => {
  let app: INestApplication
  let prismaService: PrismaService
  let adminFactory: AdminFactory
  let delivererFactory: DelivererFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DelivererFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prismaService = moduleRef.get<PrismaService>(PrismaService)

    adminFactory = moduleRef.get(AdminFactory)
    delivererFactory = moduleRef.get(DelivererFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[PATCH] /admins/set-user-as-active/:delivererId", async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const deliverer = await delivererFactory.makePrismaDeliverer({}, { status: Status.INACTIVE })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .patch(`/admins/set-user-as-active/${deliverer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const updatedDeliverer = await prismaService.deliverer.findUnique({
      where: { id: deliverer.id.toString() }
    })

    expect(updatedDeliverer?.status).toEqual(UserStatus.ACTIVE)
  })
})