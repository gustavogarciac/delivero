import { PaginationParams } from "@/core/repositories/pagination";
import { OrdersRepository } from "@/domain/logistics/application/repositories/orders-repository";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { calculateDistanceInQuilometers } from "@/core/haversine";

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  create(order: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(order: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }
  setAsPickedUp(orderId: string, delivererId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  setAsDelivered(orderId: string, delivererId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findMany(params: PaginationParams): Promise<{ items: Order[]; total?: number; }> {
    throw new Error("Method not implemented.");
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
  findManyByDelivererId(params: PaginationParams, delivererId: string): Promise<{ items: Order[]; total?: number; }> {
    throw new Error("Method not implemented.");
  }
  
}