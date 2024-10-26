import { Mailer, SendMailRequest } from "@/domain/logistics/application/mailer/mailer";

export class FakeMailer extends Mailer {
  private sentEmails: SendMailRequest[] = [];

  async send(options: SendMailRequest): Promise<SendMailRequest | null> {
    this.sentEmails.push(options);

    if(options.to === "invalid-email") {
      return null;
    }

    return options;
  }

  getSentEmails(): SendMailRequest[] {
    return this.sentEmails;
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }
}