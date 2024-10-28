import { ApiProperty } from "@nestjs/swagger";
import { SetUserAsActiveParamSchema } from "../set-user-as-active.controller";

export class SetUserAsActiveDTO implements SetUserAsActiveParamSchema {
  @ApiProperty({
    description: "This is the field that represents the deliverer id, it is a string and an uuid",
    example: "f4b3b3b3-507b-4b98-bccf-b7f5f5e4b5f7"
  })
  delivererId: string
  constructor(props: SetUserAsActiveParamSchema) {
    this.delivererId = props.delivererId
  }
}