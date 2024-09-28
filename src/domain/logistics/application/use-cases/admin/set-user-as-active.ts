import { Either, left, right } from "@/core/either"
import { AdminsRepository } from "../../repositories/admins-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { DeliverersRepository } from "../../repositories/deliverers-repository"

interface SetUserAsActiveUseCaseRequest {
  delivererId: string
  adminId: string
}

type SetUserAsActiveUseCaseResponse = Either<ResourceNotFoundError, object>

export class SetUserAsActiveUseCase {
  constructor(private adminsRepository: AdminsRepository, private deliverersRepository: DeliverersRepository) {}

  async execute({
    delivererId,
    adminId
  } : SetUserAsActiveUseCaseRequest): Promise<SetUserAsActiveUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)
    
    if(!deliverer) {
      return left(new ResourceNotFoundError)
    }

    const admin = await this.adminsRepository.findById(adminId)

    if(!admin) {
      return left(new ResourceNotFoundError)
    }

    await this.adminsRepository.setDelivererAsActive(delivererId)

    return right({ admin })
  }
}