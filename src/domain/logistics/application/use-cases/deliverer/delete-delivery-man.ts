import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../../repositories/deliverers-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface DeleteDeliveryManUseCaseRequest {
  deliveryManId: string
}

type DeleteDeliveryManUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteDeliveryManUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({ deliveryManId } : DeleteDeliveryManUseCaseRequest): Promise<DeleteDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryMenRepository.findById(deliveryManId)

    if(!deliveryMan) {
      return left(new ResourceNotFoundError)
    }

    await this.deliveryMenRepository.delete(deliveryMan)

    return right({})
  }
}