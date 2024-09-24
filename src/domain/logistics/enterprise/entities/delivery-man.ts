import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Cpf } from "./value-objects/cpf";

export interface DeliveryManProps {
  name: string
  cpf: Cpf
  password: string
  createdAt?: Date | null
  updatedAt?: Date | null
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name
  }
  get cpf() {
    return this.props.cpf
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
    cpf, 
    password,
  }: DeliveryManProps, id?: UniqueEntityId) {
    const deliveryMan = new DeliveryMan({
      name,
      cpf,
      password,
      createdAt: new Date(),
      updatedAt: null
    }, id)

    return deliveryMan
  }
}