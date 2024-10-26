import { Mailer } from "@/domain/logistics/application/mailer/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./nodemailer";
import { EnvModule } from "../env/env.module";

@Module({
  providers: [
    {
      provide: Mailer,
      useClass: MailService
    },
  ],
  exports: [Mailer],
  imports: [EnvModule]
})
export class MailerModule {}