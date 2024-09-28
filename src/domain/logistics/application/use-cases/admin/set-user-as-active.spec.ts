import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { makeDeliverer } from "test/factories/make-deliverer"
import { SetUserAsActiveUseCase } from "./set-user-as-active"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { Status } from "@/domain/logistics/enterprise/entities/user"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { makeAdmin } from "test/factories/make-admin"

let delivererRepository: InMemoryDelivererRepository
let adminsRepository: InMemoryAdminsRepository
let sut: SetUserAsActiveUseCase

describe("Authenticate Deliverer Use Case", async () => {
  beforeEach(async () => {
    delivererRepository = new InMemoryDelivererRepository()
    adminsRepository = new InMemoryAdminsRepository(delivererRepository)
    sut = new SetUserAsActiveUseCase(adminsRepository, delivererRepository)
  })

  it("should be able to set a deliverer as active", async () => {
    const deliverer = makeDeliverer({}, { status: Status.INACTIVE }, new UniqueEntityId('deliverer-id'))
    const admin = makeAdmin({}, {}, new UniqueEntityId('admin-id'))

    delivererRepository.items.push(deliverer)
    adminsRepository.items.push(admin)

    const result = await sut.execute({ delivererId: "deliverer-id", adminId: "admin-id" })

    expect(result.isRight()).toBeTruthy()

    expect(delivererRepository.items[0].status).toBe(Status.ACTIVE)
  })
})