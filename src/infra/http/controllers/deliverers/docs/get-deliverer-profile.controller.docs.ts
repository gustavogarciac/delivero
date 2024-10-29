import { ApiProperty } from "@nestjs/swagger";
import { GetDelivererProfileSchema } from "../get-deliverer-profile.controller";
import { DelivererPresenter } from "@/infra/http/presenters/deliverer-presenter";

export class GetDelivererProfileResponseDTO implements DelivererPresenter {}

export class GetDelivererProfileRequestDTO implements GetDelivererProfileSchema {
  @ApiProperty({
    description: "This field is the deliverer id. It is an UUID.",
    example: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
  })
  delivererId: string

  constructor(props: GetDelivererProfileSchema) {
    this.delivererId = props.delivererId
  }
}