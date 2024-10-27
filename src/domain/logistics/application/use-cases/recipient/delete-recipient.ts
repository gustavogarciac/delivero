import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Injectable } from "@nestjs/common";

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<BadRequestError, object>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if(!recipient) {
      return left(new BadRequestError('Recipient with same email already exists'))
    }
    
    await this.recipientsRepository.delete(recipient)

    return right({})
  }
}