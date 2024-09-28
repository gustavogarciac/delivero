import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { GetDelivererProfileUseCase } from "./get-delivery-man-profile"
import { makeDeliverer } from "test/factories/make-deliverer"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { GetNearOrdersUseCase } from "./get-near-orders"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization"

let deliverersRepository: InMemoryDelivererRepository
let ordersRepository: InMemoryOrdersRepository
let sut: GetNearOrdersUseCase

describe("Get Near Orders Use Case", async () => {
  beforeEach(async () => {
    deliverersRepository = new InMemoryDelivererRepository()
    ordersRepository = new InMemoryOrdersRepository()
    sut = new GetNearOrdersUseCase(deliverersRepository, ordersRepository)
  })

  it("should be able to get near orders", async () => {
    const deliverer = makeDeliverer()
    const orders = Array.from({ length: 5 }, () => makeOrder({ 
      delivererId: null, 
      status: OrderStatus.AWAITING_PICKUP,
      geo: Geolocalization.create({ latitude: -29.9159783, longitude: -50.2606405 })
    }))

    await deliverersRepository.items.push(deliverer)
    await ordersRepository.items.push(...orders)

    const response = await sut.execute({ 
      delivererId: deliverer.id.toString(),
      latitude: -29.8924665, 
      longitude: -50.2488092, 
      maxDistance: 1000
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      orders: orders
    })
  })
})