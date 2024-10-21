import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Deliverer } from "../../../enterprise/entities/deliverer"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"
import { Geolocalization } from "@/domain/logistics/enterprise/entities/value-objects/geolocalization"
import { Injectable } from "@nestjs/common"

interface CreateDelivererUseCaseRequest {
  cpf: string
  name: string
  password: string
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
    cpf,
    name,
    password,
    email,
    latitude,
    longitude,
    phone
  } : CreateDelivererUseCaseRequest): Promise<CreateDelivererUseCaseResponse> {
    const cpfIsValid = Cpf.isValid(cpf)

    if(!cpfIsValid) {
      return left(new BadRequestError('Invalid CPF'))
    }

    const delivererWithExistingCpf = await this.deliverersRepository.findByCpf(cpf)

    if(delivererWithExistingCpf) {
      return left(new BadRequestError('CPF already in use'))
    }

    const deliverer = Deliverer.create({
      deliveriesCount: 0,
      geo: new Geolocalization({ latitude, longitude }),
      isAvailable: false,
      rating: 5,
    }, {
      cpf: Cpf.create(cpf),
      name,
      password: await this.hasher.hash(password),
      email,
      phone,
    })

    await this.deliverersRepository.create(deliverer)

    return right({ deliverer })
  }
}