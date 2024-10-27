import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { MailerModule } from "../mailer/mailer.module";
import { DelivererModule } from "./controllers/deliverers/deliverer.module";
import { RecipientModule } from "./controllers/recipients/recipients.module";

@Module({
  imports: [CryptographyModule, DatabaseModule, DelivererModule, RecipientModule, MailerModule],
})
export class HttpModule {}