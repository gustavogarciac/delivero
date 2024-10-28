import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { OrderFactory } from 'test/factories/make-order'
import { DelivererFactory } from 'test/factories/make-deliverer'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Upload Order Attachment (E2E)', () => {
  let app: INestApplication
  let orderFactory: OrderFactory
  let delivererFactory: DelivererFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, DelivererFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    orderFactory = moduleRef.get<OrderFactory>(OrderFactory)
    delivererFactory = moduleRef.get<DelivererFactory>(DelivererFactory)
    recipientFactory = moduleRef.get<RecipientFactory>(RecipientFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /orders/:orderId/deliverers/:delivererId/attachments', async () => {
    const user = await delivererFactory.makePrismaDeliverer()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({ recipientId: recipient.id, delivererId: user.id })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/orders/${order.id.toString()}/deliverers/${user.id.toString()}/attachments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpg')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      orderAttachmentId: expect.any(String),
    })
  })
})