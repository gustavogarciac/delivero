import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { MailerModule } from "../mailer/mailer.module";
import { DelivererModule } from "./controllers/deliverers/deliverer.module";
import { RecipientModule } from "./controllers/recipients/recipients.module";
import { AdminsModule } from "./controllers/admins/admins.module";
import { OrdersModule } from "./controllers/orders/orders.module";
import { StorageModule } from "../storage/storage.module";
import { SessionsModule } from "./controllers/sessions/sessions.module";

@Module({
  imports: [
    CryptographyModule, 
    DatabaseModule, 
    DelivererModule, 
    RecipientModule, 
    AdminsModule,
    OrdersModule,
    MailerModule,
    StorageModule,
    SessionsModule
  ],
})
export class HttpModule {}