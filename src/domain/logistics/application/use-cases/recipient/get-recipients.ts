import { Either, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { PaginationParams } from "@/core/repositories/pagination";
import { Injectable } from "@nestjs/common";

type GetRecipientsUseCaseResponse = Either<BadRequestError, { items: Recipient[], total?: number }>

@Injectable()
export class GetRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
    count,
    query
  }: PaginationParams): Promise<GetRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepository.findMany({ page, perPage, count, query})
    
    return right({ items: recipients.items, total: recipients.total })
  }
}