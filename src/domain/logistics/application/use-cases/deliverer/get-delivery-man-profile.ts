import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"
import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer"

interface GetDelivererProfileUseCaseRequest {
  delivererId: string
}

type GetDelivererProfileUseCaseResponse = Either<ResourceNotFoundError, { deliverer: Deliverer }>

@Injectable()
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