import { Either, left, right } from "@/core/either"
import { DeliveryMenRepository } from "../../repositories/delivery-man-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"
import { PaginationParams } from "@/core/repositories/pagination"
import { DeliveryMan } from "../../../enterprise/entities/delivery-man"

type FetchDeliveryMenUseCaseResponse = Either<null, { items: DeliveryMan[]; total?: number  }>

export class FetchDeliveryMenUseCase {
  constructor(private deliveryMenRepository: DeliveryMenRepository) {}

  async execute({
    page,
    perPage,
    count,
    query
  } : PaginationParams): Promise<FetchDeliveryMenUseCaseResponse> {
    const deliveryMen = await this.deliveryMenRepository.findMany({ page, perPage, count, query })

    return right(deliveryMen)
  }
}