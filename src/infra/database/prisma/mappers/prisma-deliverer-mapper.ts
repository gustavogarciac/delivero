import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer";
import { Role } from "@/domain/logistics/enterprise/entities/role";
import { Status } from "@/domain/logistics/enterprise/entities/user";
import { Cpf } from "@/domain/logistics/enterprise/entities/value-objects/cpf";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";
import { Order, Deliverer as PrismaDeliverer, Vehicle } from "@prisma/client";
import { PrismaOrderMapper } from "./prisma-order-mapper";
import { PrismaVehicleMapper } from "./prisma-vehicle-mapper";

interface PrismaDelivererWithRelations extends PrismaDeliverer {
  orders: Order[]
  vehicles: Vehicle[]
}

export class PrismaDelivererMapper {
  static toDomain(prismaDeliverer: PrismaDelivererWithRelations): Deliverer {
    const deliverer = Deliverer.create({
      deliveriesCount: prismaDeliverer.deliveriesCount,
      geo: Geolocalization.create({
        latitude: prismaDeliverer.latitude,
        longitude: prismaDeliverer.longitude
      }),
      isAvailable: prismaDeliverer.isAvailable,
      rating: prismaDeliverer.rating,
      updatedAt: prismaDeliverer.updatedAt,
      createdAt: prismaDeliverer.registeredAt,
      orders: prismaDeliverer.orders.map(PrismaOrderMapper.toDomain),
      vehicle: PrismaVehicleMapper.toDomain(prismaDeliverer.vehicles[0])
    }, {
      cpf: Cpf.create(prismaDeliverer.cpf),
      email: prismaDeliverer.email,
      name: prismaDeliverer.name,
      password: prismaDeliverer.password,
      phone: prismaDeliverer.phone,
      registeredAt: prismaDeliverer.registeredAt,
      role: Role[prismaDeliverer.role],
      status: Status[prismaDeliverer.status],
      updatedAt: prismaDeliverer.updatedAt,
    }, new UniqueEntityId(prismaDeliverer.id))

    return deliverer
  }

}