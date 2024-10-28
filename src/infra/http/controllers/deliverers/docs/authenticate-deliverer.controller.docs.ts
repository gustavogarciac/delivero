import { ApiProperty } from "@nestjs/swagger";
import { AuthenticateDelivererSchema } from "../authenticate-deliverer.controller";

export class AuthenticateDelivererResponseDTO {
  @ApiProperty({
    description: "This field is the access token that will be used to authenticate the deliverer"
  })
  access_token: string

  constructor(props: AuthenticateDelivererResponseDTO) {
    this.access_token = props.access_token
  }
}

export class AuthenticateDelivererRequestDTO implements AuthenticateDelivererSchema {
  @ApiProperty({
    description: "This field works like and ID for the Admin. It must be unique",
    format: "xxx.xxx.xxx-xx"
  })
  cpf: string

  @ApiProperty()
  password: string

  constructor(props: AuthenticateDelivererSchema) {
    this.cpf = props.cpf
    this.password = props.password
  }
}