import { Either, left, right } from "@/core/either"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Mailer } from "../../mailer/mailer"
import { RecipientsRepository } from "../../repositories/recipients-repository"
import { Otp } from "@/domain/logistics/enterprise/entities/value-objects/otp"
import { RecipientTokenRepository } from "../../repositories/recipient-tokens-repository"

interface ResetRecipientPasswordUseCaseRequest {
  email: string
}

type ResetRecipientPasswordUseCaseResponse = Either<BadRequestError, { otp: string }>

export class ResetRecipientPasswordUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository, 
    private recipientTokenRepository: RecipientTokenRepository,
    private mailer: Mailer
  ) {}

  async execute({
    email
  } : ResetRecipientPasswordUseCaseRequest): Promise<ResetRecipientPasswordUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByEmail(email)

    if(!recipient) return left(new BadRequestError("Recipient not found"))
    
    const otp = Otp.generate(6, 10)

    await this.recipientTokenRepository.save(recipient.id.toString(), otp.value, otp.expiration)

    await this.mailer.send({
      to: recipient.email,
      subject: "Your password reset code",
      body: `Your token for resetting your password is: ${otp}. It is valid for 10 minutes.`
    })

    return right({ otp: otp.value })
  }
}