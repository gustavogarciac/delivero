import { RecipientsRepository } from "../../repositories/recipients-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Either, left, right } from "@/core/either"
import { Hasher } from "../../cryptography/hasher"
import { RecipientTokenRepository } from "../../repositories/recipient-tokens-repository"
import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { Injectable } from "@nestjs/common"

interface ConfirmRecipientPasswordResetUseCaseRequest {
  token: string
  recipientId: string
  newPassword: string
}

type ConfirmRecipientPasswordResetUseCaseResponse = Either<BadRequestError | UnauthorizedError, object>

@Injectable()
export class ConfirmRecipientPasswordResetUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository, 
    private recipientTokenRepository: RecipientTokenRepository,
    private hasher: Hasher
  ) {}

  async execute({
    recipientId,
    token,
    newPassword
  }: ConfirmRecipientPasswordResetUseCaseRequest): Promise<ConfirmRecipientPasswordResetUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new BadRequestError("Recipient not found"))
    }

    const otp = await this.recipientTokenRepository.findByRecipientIdAndToken(recipientId, token)

    if (!otp) {
      return left(new UnauthorizedError("Invalid OTP"))
    }

    const otpHasExpired = otp.expiration < new Date()

    if (otpHasExpired) {
      return left(new UnauthorizedError("Token expired"))
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    recipient.password = hashedPassword
    
    await this.recipientsRepository.save(recipient)

    return right({})
  }
}