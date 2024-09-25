import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../../repositories/delivery-man-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetDeliveryManProfileUseCaseRequest {
  deliveryManId: string
}

type GetDeliveryManProfileUseCaseResponse = Either<BadRequestError, { deliveryMan }>

export class GetDeliveryManProfileUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    deliveryManId,
  } : GetDeliveryManProfileUseCaseRequest): Promise<GetDeliveryManProfileUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if(!deliveryMan) {
      return left(new ResourceNotFoundError)
    }

    return right({ deliveryMan })
  }
}