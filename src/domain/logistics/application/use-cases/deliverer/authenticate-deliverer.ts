import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"
import { Encrypter } from "../../cryptography/encrypter"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface AuthenticateDelivererUseCaseRequest {
  cpf: Cpf
  password: string
}

type AuthenticateDelivererUseCaseResponse = Either<ResourceNotFoundError | BadRequestError, { accessToken: string }>

export class AuthenticateDelivererUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository,
    private hasher: Hasher, 
    private encrypter: Encrypter
  ) {}

  async execute({
    cpf,
    password
  } : AuthenticateDelivererUseCaseRequest): Promise<AuthenticateDelivererUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findByCpf(cpf.value)

    if(!deliverer) {
      return left(new ResourceNotFoundError)
    }

    const passwordMatch = await this.hasher.compare(password, deliverer.password)

    if (!passwordMatch) {
      return left(new BadRequestError)
    }
    
    const accessToken = await this.encrypter.encrypt({
      sub: deliverer.id.toString(),
    })

    return right({
      accessToken
    })
  }
}