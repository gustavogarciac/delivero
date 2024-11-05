import { RecipientsRepository } from "../../repositories/recipients-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Encrypter } from "../../cryptography/encrypter"

interface AuthenticateWithGoogleUseCaseRequest {
  email: string
  firstName: string
  lastName: string
  picture: string
}

type AuthenticateWithGoogleUseCaseResponse = Either<BadRequestError, { accessToken: string | null, status: string, profile: AuthenticateWithGoogleUseCaseRequest | null }>

@Injectable()
export class AuthenticateWithGoogleUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    firstName,
    lastName,
    picture
  }: AuthenticateWithGoogleUseCaseRequest): Promise<AuthenticateWithGoogleUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByEmail(email)

    let accessToken: string

    if(recipient) {
      accessToken = await this.encrypter.encrypt({
        sub: recipient.id.toString()
      })

      return right({ status: 'authenticated', accessToken, profile: null})
    }

    return right({
      status: 'awaiting-creation',
      profile: {
        email,
        firstName,
        lastName,
        picture
      },
      accessToken: null
    })
  }
}