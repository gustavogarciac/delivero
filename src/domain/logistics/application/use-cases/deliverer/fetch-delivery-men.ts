import { Either, right } from "@/core/either"
import { PaginationParams } from "@/core/repositories/pagination"
import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer";
import { DeliverersRepository } from "../../repositories/deliverers-repository";
import { Injectable } from "@nestjs/common";

type FetchDeliverersUseCaseResponse = Either<null, { items: Deliverer[]; total?: number  }>

@Injectable()
export class FetchDeliverersUseCase {
  constructor(private deliverersRepository: DeliverersRepository) {}

  async execute({
    page,
    perPage,
    count,
    query
  } : PaginationParams): Promise<FetchDeliverersUseCaseResponse> {
    const deliverers = await this.deliverersRepository.findMany({ page, perPage, count, query })

    return right(deliverers)
  }
}