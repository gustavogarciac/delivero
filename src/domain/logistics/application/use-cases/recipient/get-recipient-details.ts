import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Injectable } from "@nestjs/common";

interface GetRecipientDetailsUseCaseRequest {
  recipientId: string
}

type GetRecipientDetailsUseCaseResponse = Either<BadRequestError, { recipient: Recipient }>

@Injectable()
export class GetRecipientDetailsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId
  }: GetRecipientDetailsUseCaseRequest): Promise<GetRecipientDetailsUseCaseResponse> {
    const recipient  = await this.recipientsRepository.findById(recipientId)

    if (!recipient) return left(new BadRequestError('Recipient not found'))
    
    return right({ recipient })
  }
}