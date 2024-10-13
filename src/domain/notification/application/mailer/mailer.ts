export interface SendMailRequest {
  to: string
  subject: string
  body: string
}

export abstract class Mailer {
  abstract send(options: SendMailRequest): Promise<void>
}