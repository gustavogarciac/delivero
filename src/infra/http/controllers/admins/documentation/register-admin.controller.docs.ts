import { ApiProperty } from "@nestjs/swagger";
import { RegisterAdminSchema } from "../register-admin.controller";

export interface AdminPresenter {
  adminId: string
}

export class RegisterAdminResponseDTO implements AdminPresenter {
  @ApiProperty({
    default: '00000000-0000-0000-0000-000000000000',
    description: 'Admin Id',
    format: 'uuid',
  })
  adminId: string

  constructor(adminId: string) {
    this.adminId = adminId
  }
}

export class RegisterAdminRequestDTO implements RegisterAdminSchema {
  @ApiProperty({
    description: "This field works like and ID for the Admin. It must be unique",
    format: "xxx.xxx.xxx-xx"
  })
  cpf: string

  @ApiProperty()
  email: string

  @ApiProperty()
  name: string

  @ApiProperty()
  phone: string

  @ApiProperty()
  password: string

  constructor(props: RegisterAdminSchema) {
    this.cpf = props.cpf
    this.email = props.email
    this.name = props.name
    this.phone = props.phone
    this.password = props.password
  }
}