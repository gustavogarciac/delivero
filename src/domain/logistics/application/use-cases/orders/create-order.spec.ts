import { CreateOrderUseCase } from "./create-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { faker } from "@faker-js/faker"
import { Geolocalization } from "../../../enterprise/entities/value-objects/geolocalization"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let ordersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe("Create Order Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new CreateOrderUseCase(ordersRepository)
  })

  it("should create an order", async () => {
    const order = {
      delivererId: new UniqueEntityId(),
      recipientId: new UniqueEntityId(),
      adminId: new UniqueEntityId(),
      deliveryAddress: faker.location.streetAddress(),
      geo: Geolocalization.create({ latitude: 34.1234, longitude: -118.5678 }),
      notes: faker.lorem.sentence(),
    }

    const result = await sut.execute(order)

    expect(result.isRight()).toBeTruthy()
  })
})