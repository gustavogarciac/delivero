import { FakeHasher } from "test/cryptography/fake-hasher"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { UpdateDelivererUseCase } from "./update-deliverer"
import { makeDeliverer } from "test/factories/make-deliverer"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { BadRequestError } from "@/core/errors/bad-request-error"

let deliverersRepository: InMemoryDelivererRepository
let hasher: FakeHasher
let sut: UpdateDelivererUseCase

describe("Update deliverer Use Case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    hasher = new FakeHasher()
    sut = new UpdateDelivererUseCase(deliverersRepository, hasher)
  })

  it("should be able to update a deliverer", async () => {
    const deliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)

    const result = await sut.execute({
      delivererId: deliverer.id.toString(),
      cpf: deliverer.cpf,
      name: "John Doe",
      password: "password",
      email: "john@doe.com",
      latitude: 0,
      longitude: 0,
      phone: "123456789"
    })

    expect(result.isRight()).toBeTruthy()

    expect(deliverersRepository.items[0].name).toEqual("John Doe")
  })

  it("should throw an error if delivery man does not exist", async () => {
    const result = await sut.execute({
      delivererId: "non-existing-id",
      cpf: Cpf.create(), 
      name: "John Doe", 
      password: "password",
      email: "john@email.com",
      latitude: 0,
      longitude: 0,
      phone: "123456789"
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should throw an error if email already exists", async () => {
    const deliverer = makeDeliverer()
    const secondDeliverer = makeDeliverer()

    await deliverersRepository.items.push(deliverer)
    await deliverersRepository.items.push(secondDeliverer)

    const result = await sut.execute({
      delivererId: secondDeliverer.id.toString(),
      cpf: secondDeliverer.cpf,
      name: "John Doe",
      password: "password",
      email: deliverer.email,
      latitude: 0,
      longitude: 0,
      phone: "123456789"
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })
})