import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Vehicle, VehicleType } from "@/domain/logistics/enterprise/entities/vehicle";
import { Vehicle as PrismaVehicle } from "@prisma/client";

export class PrismaVehicleMapper {
  static toDomain(prismaVehicle: PrismaVehicle): Vehicle {
    const vehicle = Vehicle.create({
      capacity: prismaVehicle.capacity,
      color: prismaVehicle.color,
      mileage: prismaVehicle.mileage,
      model: prismaVehicle.model,
      plate: prismaVehicle.plate,
      type: VehicleType[prismaVehicle.type],
      year: prismaVehicle.year,
      createdAt: prismaVehicle.createdAt,
      updatedAt: prismaVehicle.updatedAt,
      delivererId: prismaVehicle.delivererId ? new UniqueEntityId(prismaVehicle.delivererId) : null
    }, new UniqueEntityId(prismaVehicle.id))

    return vehicle
  }
}