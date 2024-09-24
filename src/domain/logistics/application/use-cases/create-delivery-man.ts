import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../repositories/delivery-man-repository"
import { DeliveryMan } from "../../enterprise/entities/delivery-man"
import { BadRequestError } from "@/core/errors/bad-request-error"

interface CreateDeliveryManUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateDeliveryManUseCaseResponse = Either<BadRequestError, { deliveryMan: DeliveryMan }>

export class CreateDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    email,
    name,
    password
  } : CreateDeliveryManUseCaseRequest): Promise<CreateDeliveryManUseCaseResponse> {
    const deliveryManWithExistingEmail = await this.deliveryMenRepository.findByEmail(email)

    if(deliveryManWithExistingEmail) {
      return left(new BadRequestError)
    }

    const deliveryMan = DeliveryMan.create({
      email,
      name,
      password,
    })

    await this.deliveryMenRepository.create(deliveryMan)

    return right({ deliveryMan })
  }
}