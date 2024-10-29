import { ApiProperty } from "@nestjs/swagger";
import { PaginationQueryParamSchema } from "../fetch-deliverer.controller";
import { Order } from "@prisma/client";

type Deliverer = {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  rating: number
  deliveriesCount: number
  latitude: number
  longitude: number
  isAvailable: boolean
  status: string
  role: string
  vehicle: string
  orders: Order[]
  registeredAt: Date
  updatedAt: Date
}

export class FetchDelivererResponseDTO {
  @ApiProperty({
    description: "This is an array of deliverers",
  })
  deliverers: Deliverer[]

  @ApiProperty({
    description: "This is the total of deliverers returned by the query",
  })
  total: number | undefined
  
  constructor(props: FetchDelivererResponseDTO) {
    this.deliverers = props.deliverers
    this.total = props.total
  }
}

export class FetchDelivererRequestDTO implements PaginationQueryParamSchema {
  @ApiProperty({
    description: "This field is the page number that you want to fetch",
    default: 1,
  })
  page: number

  @ApiProperty({
    description: "This field is the number of items per page",
    default: 10,
  })
  per_page: number

  @ApiProperty({
    description: "This field is the flag to count the total of items",
    default: false,
  })
  count: boolean

  @ApiProperty({
    description: "This field is the query to search for deliverers",
    default: "",
  })
  query: string | undefined

  constructor(props: PaginationQueryParamSchema) {
    this.page = props.page
    this.per_page = props.per_page
    this.count = props.count
    this.query = props.query
  }
}