import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Deliverer, DelivererProps } from "@/domain/logistics/enterprise/entities/deliverer";
import { Role } from "@/domain/logistics/enterprise/entities/role";
import { Status, UserProps } from "@/domain/logistics/enterprise/entities/user";
import { Cpf } from "@/domain/logistics/enterprise/entities/value-objects/cpf";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";
import { Vehicle } from "@/domain/logistics/enterprise/entities/vehicle";
import { faker } from "@faker-js/faker";
import { makeVehicle } from "./make-vehicle";

export function makeDeliverer(
  overrideDeliveryManProps: Partial<DelivererProps> = {},
  overrideUserProps: Partial<UserProps> = {},
  id?: UniqueEntityId
) {
  /* 
  * This function creates a Deliverer entity with the given properties.
  * If no properties are given, random values will be generated.
  */
  const deliveryMan = Deliverer.create(
    {
      deliveriesCount: faker.number.int({ min: 0, max: 100 }),
      isAvailable: faker.datatype.boolean(),
      rating: faker.number.int({
        min: 0,
        max: 5,
      }),
      geo: Geolocalization.create({ latitude: faker.location.latitude(), longitude: faker.location.longitude() }),
      orders: [],
      ...overrideDeliveryManProps
    },
    {
      cpf: Cpf.create(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      registeredAt: faker.date.past(),
      role: new Role("deliverer"),
      status: Status.ACTIVE,
      updatedAt: faker.date.past(),
      ...overrideUserProps
    },
    id
  )

  deliveryMan.vehicle = Vehicle.create(makeVehicle({ delivererId: deliveryMan.id }))

  return deliveryMan
}