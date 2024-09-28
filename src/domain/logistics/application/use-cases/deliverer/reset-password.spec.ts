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

let deliverersRepository: InMemoryDelivererRepository
let fakeEncrypter: FakeEncrypter
let fakeMailer: FakeMailer
let sut: ResetDelivererPasswordUseCase

describe("Reset deliverer password use case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeMailer = new FakeMailer()
    sut = new ResetDelivererPasswordUseCase(deliverersRepository, fakeEncrypter, fakeMailer)
  })

  it("should be able to request deliverer's password reset", async () => {
    const deliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)
  
    const response = await sut.execute({
      email: deliverer.email
    })

    expect(response.isRight()).toBe(true)
    expect(response.value).toEqual({ token: expect.any(String) })
  })

  it("should send an email with the reset link", async () => {
    const deliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)
  
    await sut.execute({
      email: deliverer.email
    })

    expect(fakeMailer.getSentEmails()).toHaveLength(1)
    expect(fakeMailer.getSentEmails()[0].to).toBe(deliverer.email)
    expect(fakeMailer.getSentEmails()[0].subject).toBe("Password reset")
  })

  it("should not be able to request deliverer's password reset if deliverer does not exist", async () => {
    const response = await sut.execute({
      email: "non-existing-user@email.com"
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(BadRequestError)
  })
})