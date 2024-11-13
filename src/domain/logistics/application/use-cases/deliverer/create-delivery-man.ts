import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Deliverer } from "../../../enterprise/entities/deliverer"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Hasher } from "../../cryptography/hasher"
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization"
import { Injectable } from "@nestjs/common"

interface CreateDelivererUseCaseRequest {
  name: string
  password?: string | null
  email: string
  phone: string
  latitude: number
  longitude: number
}

type CreateDelivererUseCaseResponse = Either<BadRequestError, { deliverer: Deliverer }>

@Injectable()
export class CreateDelivererUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private hasher: Hasher) {}

  async execute({
    name,
    password,
    email,
    latitude,
    longitude,
    phone
  } : CreateDelivererUseCaseRequest): Promise<CreateDelivererUseCaseResponse> {
    const delivererWithExistingEmail = await this.deliverersRepository.findByEmail(email)

    if(delivererWithExistingEmail) {
      return left(new BadRequestError('Email already in use'))
    }

    const deliverer = Deliverer.create({
      deliveriesCount: 0,
      geo: new Geolocalization({ latitude, longitude }),
      isAvailable: false,
      rating: 5,
    }, {
      name,
      password: password ? await this.hasher.hash(password) : null,
      email,
      phone,
    })

    await this.deliverersRepository.create(deliverer)

    return right({ deliverer })
  }
}