import { Entity } from "@/core/entities/entity";

export type RecipientTokenProps = {
  recipientId: string
  token: string
  expiration: Date
}

export class RecipientToken extends Entity<RecipientTokenProps> {
  get recipientId(): string {
    return this.props.recipientId
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

  set recipientId(recipientId: string) {
    this.props.recipientId = recipientId
  }

  protected constructor(props: RecipientTokenProps) {
    super(props)
  }

  static create(props: RecipientTokenProps): RecipientToken {
    return new RecipientToken(props)
  }
}