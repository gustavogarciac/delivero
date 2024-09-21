import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface DeliveryManProps {
  name: string
  email: string
  password: string
  createdAt?: Date | null
  updatedAt?: Date | null
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

  static create({
    name,
    email, 
    password,
  }: DeliveryManProps, id?: UniqueEntityId) {
    const deliveryMan = new DeliveryMan({
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: null
    }, id)

    return deliveryMan
  }
}