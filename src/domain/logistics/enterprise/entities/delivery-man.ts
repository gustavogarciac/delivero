import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface DeliveryManProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name
  }
  get email() {
    return this.props.email
  }
  get password() {
    return this.props.password
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: DeliveryManProps, id?: UniqueEntityId) {
    const deliveryMan = new DeliveryMan(props, id)

    return deliveryMan
  }
}