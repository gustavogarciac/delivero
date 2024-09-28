import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Order, OrderProps, OrderStatus } from "@/domain/logistics/enterprise/entities/order";
import { makeDeliverer } from "./make-deliverer";
import { faker } from "@faker-js/faker";
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization";

function randomStatus(): OrderStatus {
  const status = Object.values(OrderStatus) as OrderStatus[];
  const randomIndex = Math.floor(Math.random() * status.length);
  return status[randomIndex];
}

/** 
* This function creates an Order entity with the given properties.
* If no properties are given, random values will be generated.
**/
export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId
) {
  const deliverer = makeDeliverer()

  const order = Order.create({
    delivererId: deliverer.id,
    deliveryAddress: faker.location.streetAddress(),
    geo: Geolocalization.create({ latitude: faker.location.latitude(), longitude: faker.location.longitude() }),
    recipientId: new UniqueEntityId(),
    status: randomStatus(),
    adminId: new UniqueEntityId(),
    deliveredAt: null,
    notes: faker.lorem.sentence(),
    pickedAt: null,
    returnedAt: null,
    trackingNumber: faker.string.uuid(),
    ...override
  }, id)

  return order
}