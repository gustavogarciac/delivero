import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { OrderStatus } from "@/domain/logistics/enterprise/entities/order";
import { makeDeliverer } from "./make-deliverer";
import { faker } from "@faker-js/faker";
import { makeOrder } from "./make-order";
import { OrderAttachment, OrderAttachmentProps } from "@/domain/logistics/enterprise/entities/order-attachment";
import { AttachmentProps, AttachmentType } from "@/domain/logistics/enterprise/entities/attachment";

function randomStatus(): OrderStatus {
  const status = Object.values(OrderStatus) as OrderStatus[];
  const randomIndex = Math.floor(Math.random() * status.length);
  return status[randomIndex];
}

/** 
* This function creates an Order Attachment entity with the given properties.
* If no properties are given, random values will be generated.
**/
export function makeOrderAttachment(
  overrideOrderAttachmentProps: Partial<OrderAttachmentProps> = {},
  overrideAttachmentProps: Partial<AttachmentProps> = {},
  id?: UniqueEntityId
) {
  const deliverer = makeDeliverer()
  const order = makeOrder({ delivererId: deliverer.id })

  if(!order.delivererId) {
    throw new Error("Order must have a deliverer to have an attachment")
  }
  
  const orderAttachment = OrderAttachment.create({
    delivererId: order.delivererId.toString(),
    orderId: order.id.toString(),
    ...overrideOrderAttachmentProps
  }, {
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    type: AttachmentType.ORDER,
    ...overrideAttachmentProps
  }, id)

  return orderAttachment
}