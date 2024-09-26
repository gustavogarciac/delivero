import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../../repositories/delivery-man-repository"
import { DeliveryMan } from "../../../enterprise/entities/deliverer"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"

interface CreateDeliveryManUseCaseRequest {
  name: string
  cpf: Cpf
  password: string
}

type CreateDeliveryManUseCaseResponse = Either<BadRequestError, { deliveryMan: DeliveryMan }>

export class CreateDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository, private hasher: Hasher) {}

  async execute({
    cpf,
    name,
    password
  } : CreateDeliveryManUseCaseRequest): Promise<CreateDeliveryManUseCaseResponse> {
    const deliveryManWithExistingCpf = await this.deliveryMenRepository.findByCpf(cpf.value)

    if(deliveryManWithExistingCpf) {
      return left(new BadRequestError)
    }

    const deliveryMan = DeliveryMan.create({
      cpf,
      name,
      password: await this.hasher.hash(password),
    })

    await this.deliveryMenRepository.create(deliveryMan)

    return right({ deliveryMan })
  }
}