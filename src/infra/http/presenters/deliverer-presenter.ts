import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer"
import { Order } from "@/domain/logistics/enterprise/entities/order"
import { OrderPresenter } from "./order-presenter"

export class DelivererPresenter {
  static toHttp(deliverer: Deliverer) {
    return {
      id: deliverer.id.toString(),
      name: deliverer.name,
      email: deliverer.email,
      cpf: deliverer.cpf.value,
      phone: deliverer.phone,
      rating: deliverer.rating,
      deliveriesCount: deliverer.deliveriesCount,
      latitude: deliverer.geo.latitude,
      longitude: deliverer.geo.longitude,
      isAvailable: deliverer.isAvailable,
      status: deliverer.status,
      role: deliverer.role,
      vehicle: deliverer.vehicle,
      orders: deliverer.orders.map(OrderPresenter.toHttp),
      registeredAt: deliverer.registeredAt,
      updatedAt: deliverer.updatedAt,
    }
  }
}