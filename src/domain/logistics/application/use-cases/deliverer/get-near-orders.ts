import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Deliverer } from "../../../enterprise/entities/deliverer"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization"
import { Order } from "@/domain/logistics/enterprise/entities/order"
import { OrdersRepository } from "../../repositories/orders-repository"
import { Injectable } from "@nestjs/common"

interface GetNearOrdersUseCaseRequest {
  delivererId: string
  latitude: number
  longitude: number
  maxDistance: number
}

type GetNearOrdersUseCaseResponse = Either<BadRequestError, { orders: Order[] }>

@Injectable()
export class GetNearOrdersUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private ordersRepository: OrdersRepository) {}

  async execute({
    delivererId,
    latitude,
    longitude,
    maxDistance
  } : GetNearOrdersUseCaseRequest): Promise<GetNearOrdersUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    const geolocalization = new Geolocalization({ latitude, longitude })

    const orders = await this.ordersRepository.findManyNear(geolocalization, maxDistance)

    return right({ orders })
  }
}