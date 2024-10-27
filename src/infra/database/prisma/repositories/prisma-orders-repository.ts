import { PaginationParams } from "@/core/repositories/pagination";
import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { calculateDistanceInQuilometers } from "@/core/haversine";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  create(order: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(order: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      }
    })

    if(!order) return null

    return PrismaOrderMapper.toDomain(order)
  }
  setAsPickedUp(orderId: string, delivererId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  setAsDelivered(orderId: string, delivererId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findMany(params: PaginationParams): Promise<{ items: Order[]; total?: number; }> {
    const { page, perPage, count } = params

    const orders = await this.prisma.order.findMany({
      take: perPage,
      skip: (page - 1) * perPage
    })

    return {
      items: orders.map(PrismaOrderMapper.toDomain),
      total: count ? orders.length : undefined
    }
  }
  async findManyNear(delivererGeo: Geolocalization, maxDistance: number): Promise<Order[]> {
    const { latitude: delivererLatitude, longitude: delivererLongitude } = delivererGeo;

    const orders = await this.prisma.$queryRawUnsafe<Order[]>(`
        SELECT *
        FROM "Order"
        WHERE "status" = 'AWAITING_PICKUP' 
        AND (
            6371 * acos(
                cos(radians(${delivererLatitude})) * 
                cos(radians("latitude")) * 
                cos(radians("longitude") - radians(${delivererLongitude})) + 
                sin(radians(${delivererLatitude})) * sin(radians("latitude"))
            )
        ) <= ${maxDistance}
    `);

    return orders;
  }
  async findManyByDelivererId(params: PaginationParams, delivererId: string): Promise<{ items: Order[]; total?: number; }> {
    const { page, perPage, count } = params;
  
    const orders = await this.prisma.order.findMany({
      where: {
        delivererId
      },
      take: perPage,
      skip: (page - 1) * perPage
    })

    return {
      items: orders.map(PrismaOrderMapper.toDomain),
      total: count ? await this.prisma.order.count({ where: { delivererId } }) : undefined
    }
  }
  
}