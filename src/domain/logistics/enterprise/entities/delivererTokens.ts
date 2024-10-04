import { Entity } from "@/core/entities/entity";

type DelivererTokenProps = {
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

  protected constructor(props: DelivererTokenProps) {
    super(props)
  }

  static create(props: DelivererTokenProps): DelivererToken {
    return new DelivererToken(props)
  }
}