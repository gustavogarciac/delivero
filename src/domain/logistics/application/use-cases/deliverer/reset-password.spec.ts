import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { ListPendingOrdersUseCase } from "./list-pending-orders"
import { ResetDelivererPasswordUseCase } from "./reset-password"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeMailer } from "test/mailer/mailer"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { InMemoryDelivererTokenRepository } from "test/repositories/in-memory-deliverer-tokens-repository"

let deliverersRepository: InMemoryDelivererRepository
let delivererTokensRepository: InMemoryDelivererTokenRepository
let fakeMailer: FakeMailer
let sut: ResetDelivererPasswordUseCase

describe("Reset deliverer password use case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    delivererTokensRepository = new InMemoryDelivererTokenRepository()
    fakeMailer = new FakeMailer()
    sut = new ResetDelivererPasswordUseCase(deliverersRepository, delivererTokensRepository, fakeMailer)
  })

  it("should be able to request deliverer's password reset", async () => {
    const deliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)
  
    const response = await sut.execute({
      email: deliverer.email
    })

    expect(response.isRight()).toBe(true)

    expect(response.value).toEqual({ otp: expect.any(String) })

    expect(delivererTokensRepository.items).toHaveLength(1)
    expect(delivererTokensRepository.items[0].delivererId).toBe(deliverer.id.toString())
  })

  it("should send an email with the reset link", async () => {
    const deliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)
  
    await sut.execute({
      email: deliverer.email
    })

    expect(fakeMailer.getSentEmails()).toHaveLength(1)
    expect(fakeMailer.getSentEmails()[0].to).toBe(deliverer.email)
    expect(fakeMailer.getSentEmails()[0].subject).toBe("Your password reset code")
  })

  it("should not be able to request deliverer's password reset if deliverer does not exist", async () => {
    const response = await sut.execute({
      email: "non-existing-user@email.com"
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(BadRequestError)
  })
})