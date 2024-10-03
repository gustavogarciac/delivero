import { Entity } from "@/core/entities/entity";

type RecipientTokensProps = {
  recipientId: string
  token: string
  expiration: Date
}

export class RecipientTokens extends Entity<RecipientTokensProps> {
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

  protected constructor(props: RecipientTokensProps) {
    super(props)
  }

  static create(props: RecipientTokensProps): RecipientTokens {
    return new RecipientTokens(props)
  }
}