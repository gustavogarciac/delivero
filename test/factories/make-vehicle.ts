import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Vehicle, VehicleProps, VehicleType } from "@/domain/logistics/enterprise/entities/vehicle";
import { faker } from "@faker-js/faker";

function randomVehicleType(): VehicleType {
  const vehicleTypes = Object.values(VehicleType);
  const randomIndex = Math.floor(Math.random() * vehicleTypes.length);
  return vehicleTypes[randomIndex];
}

export function makeVehicle(
  override: Partial<VehicleProps> = {},
  id?: UniqueEntityId
) {
  const vehicle = Vehicle.create(
    {
      capacity: faker.number.int(),
      color: faker.vehicle.color(),
      model: faker.vehicle.model(),
      mileage: faker.number.int(),
      plate: faker.vehicle.vin(),
      type: randomVehicleType(),
      year: faker.date.past().getFullYear(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      ...override
    },
    id
  )

  return vehicle
}