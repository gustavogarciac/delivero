import { Entity } from "@/core/entities/entity";

type DelivererTokensProps = {
  delivererId: string
  token: string
  expiration: Date
}

export class DelivererTokens extends Entity<DelivererTokensProps> {
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

  protected constructor(props: DelivererTokensProps) {
    super(props)
  }

  static create(props: DelivererTokensProps): DelivererTokens {
    return new DelivererTokens(props)
  }
}