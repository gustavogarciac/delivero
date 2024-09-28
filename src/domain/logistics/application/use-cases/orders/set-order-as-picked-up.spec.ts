import { CreateOrderUseCase } from "./create-order"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order"
import { SetOrderAsPickedUpUseCase } from "./set-order-as-picked-up"
import { AdminsRepository } from "../../repositories/admins-repository"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { InMemoryDelivererRepository } from "test/repositories/in-memory-deliverer-repository"
import { InMemoryAdminsRepository } from "test/repositories/in-memory-admins-repository"
import { makeAdmin } from "test/factories/make-admin"
import { makeDeliverer } from "test/factories/make-deliverer"
import { Status } from "@/domain/logistics/enterprise/entities/user"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let ordersRepository: InMemoryOrdersRepository
let adminsRepository: InMemoryAdminsRepository
let deliverersRepository: InMemoryDelivererRepository
let sut: SetOrderAsPickedUpUseCase

describe("Set Order as Picked Up Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    adminsRepository = new InMemoryAdminsRepository(deliverersRepository)
    sut = new SetOrderAsPickedUpUseCase(ordersRepository, adminsRepository, deliverersRepository)
  })

  it("should set an order as picked up by a deliverer", async () => {
    const deliverer = makeDeliverer({ deliveriesCount: 0 }, {}, new UniqueEntityId("deliverer-id"))
    const admin = makeAdmin({}, {}, new UniqueEntityId("admin-id"))
    const order = makeOrder({ status: OrderStatus.AWAITING_PICKUP, adminId: admin.id })

    await ordersRepository.items.push(order)
    await adminsRepository.items.push(admin)
    await deliverersRepository.items.push(deliverer)

    const result = await sut.execute({ 
      orderId: order.id.toString(), 
      adminId: admin.id.toString(), 
      delivererId: deliverer.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    expect(ordersRepository.items[0].status).toBe(OrderStatus.IN_TRANSIT)

    expect(deliverer.deliveriesCount).toBe(1)
    expect(deliverer.orders).toEqual([
      expect.objectContaining({ id: order.id, status: OrderStatus.IN_TRANSIT })
    ])
  })
})