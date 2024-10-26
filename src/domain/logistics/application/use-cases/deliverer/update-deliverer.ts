import { Either, left, right } from "@/core/either"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Hasher } from "../../cryptography/hasher"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Injectable } from "@nestjs/common"

interface UpdateDelivererUseCaseRequest {
  delivererId: string
  name: string
  password: string
  email: string
  phone: string
}

type UpdateDelivererUseCaseResponse = Either<BadRequestError | ResourceNotFoundError, object>

@Injectable()
export class UpdateDelivererUseCase {
  constructor(private deliverersRepository: DeliverersRepository, private hasher: Hasher) {}

  async execute({
    delivererId,
    name,
    password,
    email,
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
    deliverer.email = email ?? deliverer.email
    deliverer.phone = phone ?? deliverer.phone

    await this.deliverersRepository.save(deliverer)

    return right({})
  }
}