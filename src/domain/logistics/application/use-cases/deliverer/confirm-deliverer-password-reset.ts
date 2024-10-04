import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Either, left, right } from "@/core/either"
import { Hasher } from "../../cryptography/hasher"
import { UnauthorizedError } from "@/core/errors/unauthorized-error"
import { DelivererTokenRepository } from "../../repositories/deliverer-tokens-repository"

interface ConfirmDelivererPasswordResetUseCaseRequest {
  token: string
  delivererId: string
  newPassword: string
}

type ConfirmDelivererPasswordResetUseCaseResponse = Either<BadRequestError | UnauthorizedError, object>

export class ConfirmDelivererPasswordResetUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository, 
    private delivererTokenRepository: DelivererTokenRepository,
    private hasher: Hasher
  ) {}

  async execute({
    delivererId,
    token,
    newPassword
  }: ConfirmDelivererPasswordResetUseCaseRequest): Promise<ConfirmDelivererPasswordResetUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if (!deliverer) {
      return left(new BadRequestError("Deliverer not found"))
    }

    const otp = await this.delivererTokenRepository.findByDelivererIdAndToken(delivererId, token)

    if (!otp) {
      return left(new UnauthorizedError("Invalid OTP"))
    }

    const otpHasExpired = otp.expiration < new Date()

    if (otpHasExpired) {
      return left(new UnauthorizedError("Token expired"))
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    deliverer.password = hashedPassword
    
    await this.deliverersRepository.save(deliverer)

    return right({})
  }
}