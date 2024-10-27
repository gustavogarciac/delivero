import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Order, OrderStatus } from "@/domain/logistics/enterprise/entities/order";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";
import { Order as PrismaOrder, Prisma, OrderStatus as PrismaOrderStatus } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(prismaOrder: PrismaOrder): Order {
    const order = Order.create({
      deliveryAddress: prismaOrder.deliveryAddress,
      geo: Geolocalization.create({
        latitude: prismaOrder.latitude,
        longitude: prismaOrder.longitude
      }),
      recipientId: new UniqueEntityId(prismaOrder.recipientId),
      // adminId: new UniqueEntityId(prismaOrder.adminId),
      status: OrderStatus[prismaOrder.status],
      notes: prismaOrder.notes,
      trackingNumber: prismaOrder.trackingCode,
      delivererId: prismaOrder.delivererId ? new UniqueEntityId(prismaOrder.delivererId) : null,
      pickedAt: prismaOrder.pickedAt,
      deliveredAt: prismaOrder.deliveredAt,
      updatedAt: prismaOrder.updatedAt,
      returnedAt: prismaOrder.returnedAt,
    }, new UniqueEntityId(prismaOrder.id))

    return order
  }

  static toPersistence(order: Order): Prisma.OrderCreateInput {    
    return {
      id: order.id.toString(),
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      deliverer: order.delivererId ? {
        connect: {
          id: order.delivererId.toString()
        }
      } : undefined,
      deliveryAddress: order.deliveryAddress,
      latitude: order.geo.latitude,
      longitude: order.geo.longitude,
      notes: order.notes,
      pickedAt: order.pickedAt,
      recipient: {
        connect: {
          id: order.recipientId.toString()
        }
      },
      returnedAt: order.returnedAt,
      status: PrismaOrderStatus[OrderStatus[order.status]],
      trackingCode: order.trackingNumber,
      pickupCode: order.pickupCode,
      updatedAt: order.updatedAt ?? new Date()
    }
  }
}