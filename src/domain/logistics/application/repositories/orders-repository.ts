import { PaginationParams } from "@/core/repositories/pagination";
import { Order } from "../../enterprise/entities/order";
import { Geolocalization } from "../../enterprise/entities/value-objects/geolocalization";

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(params: PaginationParams): Promise<{ items: Order[], total?: number }>
  abstract findManyNear(delivererGeo: Geolocalization, maxDistance: number): Promise<Order[]>
  abstract findManyByDelivererId(params: PaginationParams, delivererId: string): Promise<{ items: Order[], total?: number }>
}