import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { Encrypter } from "../../cryptography/encrypter"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Either, left, right } from "@/core/either"
import { Hasher } from "../../cryptography/hasher"

interface ConfirmPasswordResetUseCaseRequest {
  token: string
  delivererId: string
  newPassword: string
}

type ConfirmPasswordResetUseCaseResponse = Either<BadRequestError, object>

export class ConfirmPasswordResetUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository, 
    private encrypter: Encrypter,
    private hasher: Hasher
  ) {}

  async execute({
    delivererId,
    token,
    newPassword
  }: ConfirmPasswordResetUseCaseRequest): Promise<ConfirmPasswordResetUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findById(delivererId)

    if (!deliverer) {
      return left(new BadRequestError("Deliverer not found"))
    }

    let decryptedToken;

    try {
      decryptedToken = await this.encrypter.decrypt(token)
    } catch (error) {
      return left(new BadRequestError("Invalid or expired token"))
    }

    if (decryptedToken.sub.value !== delivererId) {
      return left(new BadRequestError("Invalid token"))
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    deliverer.password = hashedPassword
    
    await this.deliverersRepository.save(deliverer)

    return right({})
  }
}