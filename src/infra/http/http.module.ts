import { Module } from "@nestjs/common";
import { AuthenticateDelivererController } from "./controllers/deliverers/authenticate-deliverer.controller";
import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [AuthenticateDelivererController],
  providers: [AuthenticateDelivererUseCase]
})
export class HttpModule {}