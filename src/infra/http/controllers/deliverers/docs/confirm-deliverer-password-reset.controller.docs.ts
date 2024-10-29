import { ApiProperty } from "@nestjs/swagger";
import { ConfirmDelivererPasswordResetSchema } from "../confirm-deliverer-password-reset.controller";

export class ConfirmDelivererPasswordResetRequestDTO implements ConfirmDelivererPasswordResetSchema {
  @ApiProperty({
    description: "This field is the deliverer id that will be used to confirm the password reset. It is an UUID.",
    example: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
  })
  delivererId: string

  @ApiProperty({
    description: "This field is the new password that will be used to reset the deliverer password. It must have at least 6 characters.",
    example: "newpassword"
  })
  newPassword: string

  @ApiProperty({
    description: "This field is the token that will be used to confirm the deliverer password reset.",
    example: "3b3b3b"
  })
  token: string

  constructor(props: ConfirmDelivererPasswordResetSchema) {
    this.delivererId = props.delivererId
    this.newPassword = props.newPassword
    this.token = props.token
  }
}