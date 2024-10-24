import { Order } from "@/domain/logistics/enterprise/entities/order"

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      delivererId: order.delivererId?.toString(),
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      geo: {
        latitude: order.geo.latitude,
        longitude: order.geo.longitude
      },
      trackingCode: order.trackingNumber,
      notes: order.notes,
      pickedAt: order.pickedAt,
      deliveredAt: order.deliveredAt,
      updatedAt: order.updatedAt,
      returnedAt: order.returnedAt,
    }
  }
}