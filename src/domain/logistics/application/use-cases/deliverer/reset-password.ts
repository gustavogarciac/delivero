import { Either, left, right } from "@/core/either"
import { DeliverersRepository } from "../../repositories/deliverers-repository"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Mailer } from "../../mailer/mailer"
import { Injectable } from "@nestjs/common"
import { Otp } from "@/domain/logistics/enterprise/entities/value-objects/otp"
import { DelivererTokenRepository } from "../../repositories/deliverer-tokens-repository"

interface ResetDelivererPasswordUseCaseRequest {
  email: string
}

type ResetDelivererPasswordUseCaseResponse = Either<BadRequestError, { otp: string, sentEmail: true }>

@Injectable()
export class ResetDelivererPasswordUseCase {
  constructor(
    private deliverersRepository: DeliverersRepository, 
    private delivererTokensRepository: DelivererTokenRepository,
    private mailer: Mailer
  ) {}

  async execute({
    email
  } : ResetDelivererPasswordUseCaseRequest): Promise<ResetDelivererPasswordUseCaseResponse> {
    const deliverer = await this.deliverersRepository.findByEmail(email)

    if(!deliverer) return left(new BadRequestError("Deliverer not found"))
    
    const otp = Otp.generate(6, 10)

    await this.delivererTokensRepository.save(deliverer.id.toString(), otp.value, otp.expiration)

    const options = await this.mailer.send({
      to: deliverer.email,
      subject: "Your password reset code",
      body: `Your token for resetting your password is: ${otp.value}. It is valid for 10 minutes.`
    })

    if(!options) return left(new BadRequestError("Error sending email"))

    return right({ otp: otp.value, sentEmail: true })
  }
}