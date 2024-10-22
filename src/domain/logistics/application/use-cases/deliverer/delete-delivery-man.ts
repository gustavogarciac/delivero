import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Injectable } from "@nestjs/common"

interface DeleteDelivererUseCaseRequest {
  delivererId: string
}

type DeleteDelivererUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteDelivererUseCase {
  constructor(private deliverersRepository: DeliverersRepository) {}

  async execute({ delivererId } : DeleteDelivererUseCaseRequest): Promise<DeleteDelivererUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) {
      return left(new ResourceNotFoundError)
    }

    await this.deliverersRepository.delete(deliverer)

    return right({})
  }
}