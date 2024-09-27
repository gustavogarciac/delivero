import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

interface GetDelivererProfileUseCaseRequest {
  delivererId: string
}

type GetDelivererProfileUseCaseResponse = Either<BadRequestError, { deliverer }>

export class GetDelivererProfileUseCase {
  constructor(private deliverersRepository: DeliverersRepository) {}

  async execute({
    delivererId,
  } : GetDelivererProfileUseCaseRequest): Promise<GetDelivererProfileUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if(!deliverer) {
      return left(new ResourceNotFoundError)
    }

    return right({ deliverer })
  }
}