import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Encrypter } from "../../cryptography/encrypter"
import { randomUUID } from "node:crypto"
import { Mailer } from "../../mailer/mailer"

interface ResetDelivererPasswordUseCaseRequest {
  email: string
}

type ResetDelivererPasswordUseCaseResponse = Either<BadRequestError, { token: string }>

export class ResetDelivererPasswordUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository, 
    private encrypter: Encrypter,
    private mailer: Mailer
  ) {}

  async execute({
    email
  } : ResetDelivererPasswordUseCaseRequest): Promise<ResetDelivererPasswordUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findByEmail(email)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))

    const token = await this.encrypter.encrypt({ sub: randomUUID() })

    const resetLink = `http://localhost:3333/reset-password?token=${JSON.parse(token).sub}`

    await this.mailer.send({
      to: deliverer.email,
      subject: "Password reset",
      body: 
        `Click here to reset your password: <a href="${resetLink}">${resetLink}</a>`
    })

    return right({ token })
  }
}