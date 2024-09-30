import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";

interface RegisterRecipientUseCaseRequest {
  address: string
  city: string
  country: string
  email: string
  name: string
  phone: string
  state: string
  zip: string
}

type RegisterRecipientUseCaseResponse = Either<BadRequestError, { recipient }>

export class RegisterRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    address,
    city,
    country,
    email,
    name,
    phone,
    state,
    zip
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientWithSameEmail = await this.recipientsRepository.findByEmail(email)

    if(recipientWithSameEmail) {
      return left(new BadRequestError('Recipient with same email already exists'))
    }

    const recipient = Recipient.create({
      address,
      city,
      country,
      email,
      name,
      phone,
      state,
      zip,
    })
    
    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}