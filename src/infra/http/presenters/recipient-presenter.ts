import { Recipient } from "@/domain/logistics/enterprise/entities/recipient"
import { OrderPresenter } from "./order-presenter"

export class RecipientPresenter {
  static toHttp(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone,
      address: recipient.address,
      city: recipient.city,
      state: recipient.state,
      zip: recipient.zip,
      country: recipient.country,
      orders: recipient.orders?.map(OrderPresenter.toHttp),
      lastOrderAt: recipient.lastOrderAt,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}