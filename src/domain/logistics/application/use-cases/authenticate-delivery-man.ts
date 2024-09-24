import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../repositories/delivery-man-repository"
import { DeliveryMan } from "../../enterprise/entities/delivery-man"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../cryptography/hasher"
import { Encrypter } from "../cryptography/encrypter"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface AuthenticateDeliveryManUseCaseRequest {
  cpf: Cpf
  password: string
}

type AuthenticateDeliveryManUseCaseResponse = Either<ResourceNotFoundError | BadRequestError, { accessToken: string }>

export class AuthenticateDeliveryManUseCase {
  constructor(
    private deliveryMenRepository: DeliveryMenRepository,
    private hasher: Hasher, 
    private encrypter: Encrypter
  ) {}

  async execute({
    cpf,
    password
  } : AuthenticateDeliveryManUseCaseRequest): Promise<AuthenticateDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findByCpf(cpf.value)

    if(!deliveryMan) {
      return left(new ResourceNotFoundError)
    }

    const passwordMatch = await this.hasher.compare(password, deliveryMan.password)

    if (!passwordMatch) {
      return left(new BadRequestError)
    }
    
    const accessToken = await this.encrypter.encrypt({
      sub: deliveryMan.id.toString(),
    })

    return right({
      accessToken
    })
  }
}