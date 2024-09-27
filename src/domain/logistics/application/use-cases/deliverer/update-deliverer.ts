import { Either, left, right } from "@/core/either"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Hasher } from "../../cryptography/hasher"
import { DeliverersRepository } from "../../repositories/deliverers-repository"

interface UpdateDelivererUseCaseRequest {
  delivererId: string
  latitude: number
  longitude: number
  name: string
  cpf: Cpf
  password: string
  email: string
  phone: string
}

type UpdateDelivererUseCaseResponse = Either<BadRequestError | ResourceNotFoundError, object>

export class UpdateDelivererUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private hasher: Hasher) {}

  async execute({
    delivererId,
    cpf,
    name,
    password,
    email,
    latitude,
    longitude,
    phone,
  } : UpdateDelivererUseCaseRequest): Promise<UpdateDelivererUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) {
      return left(new ResourceNotFoundError())
    }

    const emailAlreadyExists = await this.deliverersRepository.findByEmail(email)

    if(emailAlreadyExists && emailAlreadyExists.id.toString() !== delivererId) {
      return left(new BadRequestError())
    }

    deliverer.name = name ?? deliverer.name
    deliverer.password = await this.hasher.hash(password) ?? deliverer.password
    deliverer.cpf = cpf ?? deliverer.cpf
    deliverer.email = email ?? deliverer.email
    deliverer.phone = phone ?? deliverer.phone
    deliverer.geo.latitude = latitude ?? deliverer.geo.latitude
    deliverer.geo.longitude = longitude ?? deliverer.geo.longitude

    await this.deliverersRepository.save(deliverer)

    return right({})
  }
}