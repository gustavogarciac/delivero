import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { AuthenticateDelivererController } from "@/infra/controllers/deliverer/authenticate-deliverer.controller";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateDelivererController],
  providers: [AuthenticateDelivererUseCase]
})
export class DelivererModule {}