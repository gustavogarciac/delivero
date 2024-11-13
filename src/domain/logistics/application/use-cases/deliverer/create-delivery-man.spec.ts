import { CreateDelivererUseCase } from "./create-delivery-man"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"

let delivererRepository: InMemoryDelivererRepository
let hasher: FakeHasher
let sut: CreateDelivererUseCase

describe("Create Deliverer Use Case", async () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    hasher = new FakeHasher()
    sut = new CreateDelivererUseCase(delivererRepository, hasher)
  })

  it("should be able to create a deliverer", async () => {
    const deliverer = makeDeliverer({}, {})

    const result = await sut.execute({
      email: deliverer.email,
      latitude: deliverer.geo.latitude,
      longitude: deliverer.geo.longitude,
      name: deliverer.name,
      password: deliverer.password,
      phone: deliverer.phone
    })

    expect(result.isRight()).toBeTruthy()

    expect(delivererRepository.items.length).toEqual(1)
  })

  it("should not create a deliverer with an existing email", async () => {
    const deliverer = makeDeliverer({}, { email: "first@deliverer.com" })
    const secondDeliverer = makeDeliverer({}, { email: "first@deliverer.com" })

    delivererRepository.items.push(deliverer)

    const result = await sut.execute({
      email: secondDeliverer.email,
      latitude: secondDeliverer.geo.latitude,
      longitude: secondDeliverer.geo.longitude,
      name: secondDeliverer.name,
      password: secondDeliverer.password,
      phone: secondDeliverer.phone
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })

  it("should hash the password before saving", async () => {
    const result = await sut.execute({
      name: "John Doe",
      password: "password",
      email: "john@doe.com",
      latitude: 0,
      longitude: 0,
      phone: "123456789"
    })
    
    expect(result.isRight()).toBeTruthy()

    const hashedPassword = await hasher.hash("password")

    expect(delivererRepository.items[0].password).toEqual(hashedPassword)
  })
})