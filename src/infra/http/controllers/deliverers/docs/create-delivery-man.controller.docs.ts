import { ApiProperty } from "@nestjs/swagger";
import { CreateDelivererSchema } from "../create-delivery-man.controller";

export class CreateDelivererResponseDTO {
  @ApiProperty({
    description: "This field is the deliverer id that was created. It is an UUID.",
    example: "d2b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
  })
  delivererId: string

  constructor(props: CreateDelivererResponseDTO) {
    this.delivererId = props.delivererId
  }
}

export class CreateDelivererRequestDTO implements CreateDelivererSchema {
  @ApiProperty({
    description: "This field works like and ID for the Admin. It must be unique",
    format: "xxx.xxx.xxx-xx"
  })
  cpf: string

  @ApiProperty({
    description: "This field is the password that will be used to authenticate the deliverer. It must have at least 6 characters"
  })
  password: string
  
  @ApiProperty({
    description: "This field is the name of the deliverer"
  })
  name: string

  @ApiProperty({
    description: "This field is the email of the deliverer. It must be unique"
  })
  email: string
  
  @ApiProperty({
    description: "This field is the phone number of the deliverer"
  })
  phone: string
  
  @ApiProperty({
    description: "This field is the latitude of the deliverer location",
    example: -23.5505199
  })
  latitude: number
  
  @ApiProperty({
    description: "This field is the longitude of the deliverer location",
    example: -46.6333094
  })
  longitude: number

  constructor(props: CreateDelivererSchema) {
    this.cpf = props.cpf
    this.password = props.password
    this.name = props.name
    this.email = props.email
    this.phone = props.phone
    this.latitude = props.latitude
    this.longitude = props.longitude
  }
}