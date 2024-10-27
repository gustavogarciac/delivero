import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Injectable } from "@nestjs/common";

interface UpdateRecipientUseCaseRequest {
  recipientId: string
  address: string
  city: string
  country: string
  email: string
  name: string
  phone: string
  state: string
  zip: string
}

type UpdateRecipientUseCaseResponse = Either<BadRequestError, object>

@Injectable()
export class UpdateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    address,
    city,
    country,
    email,
    name,
    phone,
    state,
    zip
  }: UpdateRecipientUseCaseRequest): Promise<UpdateRecipientUseCaseResponse> {
    const recipient  = await this.recipientsRepository.findById(recipientId)

    if (!recipient) return left(new BadRequestError('Recipient not found'))

    const recipientWithEmail = await this.recipientsRepository.findByEmail(email)

    if (recipientWithEmail && recipientWithEmail.id.toString() !== recipientId) {
      return left(new BadRequestError('Email already in use'))
    }
  
    recipient.address = address ?? recipient.address
    recipient.city = city ?? recipient.city
    recipient.country = country ?? recipient.country
    recipient.email = email ?? recipient.email
    recipient.name = name ?? recipient.name
    recipient.phone = phone ?? recipient.phone
    recipient.state = state ?? recipient.state
    recipient.zip = zip ?? recipient.zip

    await this.recipientsRepository.save(recipient)
    
    return right({})
  }
}