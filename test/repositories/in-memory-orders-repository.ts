import { calculateDistanceInQuilometers } from "@/core/haversine";
import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
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

  async findManyByDelivererId(delivererId: string): Promise<Order[]> {
    return this.items.filter((order) => order.delivererId?.toString() === delivererId)
  }

  async setAsPickedUp(id: string, delivererId: string): Promise<void> {
    const order = this.items.find((order) => order.id.toString() === id)

    if (!order) return

    order.setAsPickedUp(delivererId)
  }
}