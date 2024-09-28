import { calculateDistanceInQuilometers } from "@/core/haversine";
import { PaginationParams } from "@/core/repositories/pagination";
import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === order.id.toString())
  
    if (index !== -1) {
      this.items[index] = order;
    } else {
      this.items.push(order);
    }
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((order) => order.id.toString() === id)

    if (!order) return null

    return order
  }

  async findManyNear(delivererGeo: Geolocalization, maxDistance: number): Promise<Order[]> {
    const { latitude: delivererLatitude, longitude: delivererLongitude } = delivererGeo

    return this.items.filter((order) => {
      const { latitude, longitude } = order.geo

      const distance = calculateDistanceInQuilometers(
        latitude,
        longitude, 
        delivererLatitude, 
        delivererLongitude
      )

      return distance <= maxDistance
    })
  }

  async findManyByDelivererId(params: PaginationParams, delivererId: string): Promise<{ items: Order[], total?: number }> {
    const { page, perPage, count } = params

    const orders = this.items.filter((order) => order.delivererId?.toString() === delivererId)

    const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage)

    if(!count) return { items: paginatedOrders }

    return { items: paginatedOrders, total: this.items.length }
  }

  async setAsPickedUp(id: string, delivererId: string): Promise<void> {
    const order = this.items.find((order) => order.id.toString() === id)

    if (!order) return

    order.setAsPickedUp(delivererId)

    await this.save(order)
  }

  async setAsDelivered(orderId: string, delivererId: string): Promise<void> {
    const order = this.items.find((order) => order.id.toString() === orderId)

    if (!order) return

    order.setAsDelivered()

    await this.save(order)
  }
}