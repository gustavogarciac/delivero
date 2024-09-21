import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../repositories/delivery-man-repository"
import { DeliveryMan } from "../../enterprise/entities/delivery-man"

interface CreateDeliveryManUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateDeliveryManUseCaseResponse = Either<Error, { deliveryMan: DeliveryMan }>

export class CreateDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async handle({
    email,
    name,
    password
  } : CreateDeliveryManUseCaseRequest): Promise<CreateDeliveryManUseCaseResponse> {
    const deliveryManWithExistingEmail = await this.deliveryMenRepository.findByEmail(email)

    if(deliveryManWithExistingEmail) {
      return left(new Error)
    }

    const deliveryMan = DeliveryMan.create({
      email,
      name,
      password,
    })

    return right({ deliveryMan })
  }
}