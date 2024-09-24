import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../repositories/delivery-man-repository"
import { DeliveryMan } from "../../enterprise/entities/delivery-man"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../enterprise/entities/value-objects/cpf"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Hasher } from "../cryptography/hasher"

interface UpdateDeliveryManUseCaseRequest {
  deliveryManId: string
  name: string
  cpf: Cpf
  password: string
}

type UpdateDeliveryManUseCaseResponse = Either<BadRequestError, object>

export class UpdateDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository, private hasher: Hasher) {}

  async execute({
    deliveryManId,
    cpf,
    name,
    password
  } : UpdateDeliveryManUseCaseRequest): Promise<UpdateDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if(!deliveryMan) {
      return left(new ResourceNotFoundError)
    }

    deliveryMan.name = name ?? deliveryMan.name
    deliveryMan.password = await this.hasher.hash(password) ?? deliveryMan.password
    deliveryMan.cpf = cpf ?? deliveryMan.cpf


    await this.deliveryMenRepository.save(deliveryMan)

    return right({})
  }
}