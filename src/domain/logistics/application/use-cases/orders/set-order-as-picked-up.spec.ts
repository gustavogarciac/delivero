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

let ordersRepository: InMemoryOrdersRepository
let adminsRepository: InMemoryAdminsRepository
let deliverersRepository: InMemoryDelivererRepository
let sut: SetOrderAsPickedUpUseCase

describe("Set Order as Picked Up Use Case", async () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    deliverersRepository = new InMemoryDelivererRepository()
    adminsRepository = new InMemoryAdminsRepository(deliverersRepository)
    sut = new SetOrderAsPickedUpUseCase(ordersRepository, adminsRepository)
  })

  it("should set an order as picked up by a deliverer", async () => {
    const order = makeOrder({ status: OrderStatus.AWAITING_PICKUP })
    const admin = makeAdmin()

    await ordersRepository.items.push(order)
    await adminsRepository.items.push(admin)

    const result = await sut.execute({ orderId: order.id.toString(), adminId: admin.id.toString() })

    expect(result.isRight()).toBeTruthy()
    expect(ordersRepository.items[0].status).toBe(OrderStatus.IN_TRANSIT)
  })
})