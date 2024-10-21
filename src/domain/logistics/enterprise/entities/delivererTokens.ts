import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export type DelivererTokenProps = {
  delivererId: string
  token: string
  expiration: Date
}

export class DelivererToken extends Entity<DelivererTokenProps> {
  get delivererId(): string {
    return this.props.delivererId
  }

  get token(): string {
    return this.props.token
  }

  get expiration(): Date {
    return this.props.expiration
  }

  set expiration(expiration: Date) {
    this.props.expiration = expiration
  }

  set token(token: string) {
    this.props.token = token
  }

  set delivererId(delivererId: string) {
    this.props.delivererId = delivererId
  }

  protected constructor(props: DelivererTokenProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: DelivererTokenProps, id?: UniqueEntityId): DelivererToken {
    return new DelivererToken(props, id)
  }
}