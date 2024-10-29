import { ApiProperty } from "@nestjs/swagger";
import { DeleteDelivererSchema } from "../delete-deliverer.controller";

export class DeleteDelivererRequestDTO implements DeleteDelivererSchema {
  @ApiProperty({
    description: "This field is the deliverer id. It is an UUID.",
    example: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
  })
  delivererId: string

  constructor(props: DeleteDelivererSchema) {
    this.delivererId = props.delivererId
  }
}