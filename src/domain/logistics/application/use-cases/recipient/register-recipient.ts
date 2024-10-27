import { Either, left, right } from "@/core/either";
import { BadRequestError } from "@/core/errors/bad-request-error";
import { Recipient } from "@/domain/logistics/enterprise/entities/recipient";
import { RecipientsRepository } from "../../repositories/recipients-repository";
import { Hasher } from "../../cryptography/hasher";
import { Injectable } from "@nestjs/common";

interface RegisterRecipientUseCaseRequest {
  address: string
  city: string
  country: string
  email: string
  name: string
  phone: string
  state: string
  password: string
  zip: string
}

type RegisterRecipientUseCaseResponse = Either<BadRequestError, { recipient: Recipient }>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository, private hasher: Hasher) {}

  async execute({
    address,
    city,
    country,
    email,
    name,
    phone,
    state,
    password,
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
      password,
      zip,
    })

    const hashedPassword = await this.hasher.hash(password)

    recipient.password = hashedPassword
    
    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}