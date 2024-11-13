import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"
import { Encrypter } from "../../cryptography/encrypter"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface AuthenticateDelivererUseCaseRequest {
  email: string
  password: string
}

type AuthenticateDelivererUseCaseResponse = Either<BadRequestError, { accessToken: string }>

@Injectable()
export class AuthenticateDelivererUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private hasher: Hasher, 
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password
  } : AuthenticateDelivererUseCaseRequest): Promise<AuthenticateDelivererUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findByEmail(email)

    if(!deliverer) {
      return left(new BadRequestError("Invalid credentials"))
    }

    const passwordMatch = await this.hasher.compare(password, deliverer.password!)

    if (!passwordMatch) {
      return left(new BadRequestError("Invalid credentials"))
    }
    
    const accessToken = await this.encrypter.encrypt({
      sub: deliverer.id.toString(),
    })

    return right({
      accessToken
    })
  }
}