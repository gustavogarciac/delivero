import { BadRequestError } from "@/core/errors/bad-request-error"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { RegisterAdminUseCase } from "./register-admin"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { makeAdmin } from "test/factories/make-admin"
import { DeliverersRepository } from "../../repositories/deliverers-repository"

let deliverersRepository: DeliverersRepository
let adminsRepository: InMemoryAdminsRepository
let hasher: FakeHasher
let sut: RegisterAdminUseCase

describe("Create Admin Use Case", async () => {
  beforeEach(async () => {
    adminsRepository = new InMemoryAdminsRepository(deliverersRepository)
    hasher = new FakeHasher()
    sut = new RegisterAdminUseCase(adminsRepository, hasher)
  })

  it("should be able to create a admin", async () => {
    const admin = makeAdmin({}, {})

    const result = await sut.execute({
      email: admin.email,
      name: admin.name,
      password: admin.password,
      phone: admin.phone
    })

    expect(result.isRight()).toBeTruthy()

    expect(adminsRepository.items.length).toEqual(1)
  })

  it("should not create a admin with an existing email", async () => {
    const admin = makeAdmin({}, { email: "first@admin.com"})
    const secondAdmin = makeAdmin({}, { email: "first@admin.com"})
    
    adminsRepository.items.push(admin)

    const result = await sut.execute({
      email: secondAdmin.email,
      name: secondAdmin.name,
      password: secondAdmin.password,
      phone: secondAdmin.phone
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(BadRequestError)
  })

  it("should hash the password before saving", async () => {
    const result = await sut.execute({
      name: "John Doe",
      password: "password",
      email: "john@doe.com",
      phone: "123456789"
    })
    
    expect(result.isRight()).toBeTruthy()

    const hashedPassword = await hasher.hash("password")

    expect(adminsRepository.items[0].password).toEqual(hashedPassword)
  })
})