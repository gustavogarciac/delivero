import { Mailer, SendMailRequest } from "@/domain/logistics/application/mailer/mailer";
import nodemailer from "nodemailer";
import { EnvService } from "../env/env.service";
import { Injectable } from "@nestjs/common";

type Transporter = {
  host: string;
  port: number;
  user: string;
  pass: string;
}

@Injectable()
export class MailService extends Mailer {
  constructor(config: EnvService) {
    super();
    this.transporter = {
      host: config.get('MAIL_HOST'),
      port: config.get('MAIL_PORT'),
      user: config.get('MAIL_USER'),
      pass: config.get('MAIL_PASS'),
    }
  }

  public sentEmails: SendMailRequest[] = [];
  private transporter: Transporter = {} as Transporter;

  async configureTransporter() {
    const transporter = await nodemailer.createTransport({
      host: this.transporter.host,
      port: this.transporter.port,
      auth: {
        user: this.transporter.user,
        pass: this.transporter.pass,
      },
    })

    return transporter;
  }

  async send(options: SendMailRequest): Promise<SendMailRequest | null> {
    const transporter = await this.configureTransporter();

    const email = await transporter.sendMail({
      from: this.transporter.user,
      to: options.to,
      subject: options.subject,
      text: options.body,
    });

    if(email.rejected.length > 0) return null;
    
    this.sentEmails.push(options);

    return options;
  }
}