import { Either, left, right } from "@/core/either"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Encrypter } from "../../cryptography/encrypter"
import { Mailer } from "../../mailer/mailer"
import { RecipientsRepository } from "../../repositories/recipients-repository"

interface ResetRecipientPasswordUseCaseRequest {
  email: string
}

type ResetRecipientPasswordUseCaseResponse = Either<BadRequestError, { token: string }>

export class ResetRecipientPasswordUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository, 
    private encrypter: Encrypter,
    private mailer: Mailer
  ) {}

  async execute({
    email
  } : ResetRecipientPasswordUseCaseRequest): Promise<ResetRecipientPasswordUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByEmail(email)

    if(!recipient) return left(new BadRequestError("Recipient not found"))

    const token = await this.encrypter.encrypt({ sub: recipient.id.toString() })

    const resetLink = `http://localhost:3333/reset-password?token=${JSON.parse(token).sub}`

    await this.mailer.send({
      to: recipient.email,
      subject: "Password reset",
      body: 
        `Click here to reset your password: <a href="${resetLink}">${resetLink}</a>`
    })

    return right({ token })
  }
}