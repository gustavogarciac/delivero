import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { DelivererModule } from "./controllers/deliverer.module";

@Module({
  imports: [CryptographyModule, DatabaseModule, DelivererModule],
})
export class HttpModule {}