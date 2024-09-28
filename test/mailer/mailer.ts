import { Mailer, SendMailRequest } from "@/domain/logistics/application/mailer/mailer";

export class FakeMailer extends Mailer {
  private sentEmails: SendMailRequest[] = [];

  async send(options: SendMailRequest): Promise<void> {
    this.sentEmails.push(options);
  }

  getSentEmails(): SendMailRequest[] {
    return this.sentEmails;
  }

  clearSentEmails(): void {
    this.sentEmails = [];
  }
}