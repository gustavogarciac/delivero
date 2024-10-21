import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { AuthenticateDelivererController } from "./deliverers/authenticate-deliverer.controller";
import { ConfirmDelivererPasswordResetController } from "./deliverers/confirm-deliverer-password-reset.controller";
import { ConfirmDelivererPasswordResetUseCase } from "@/domain/logistics/application/use-cases/deliverer/confirm-deliverer-password-reset";
import { CreateDelivererController } from "./deliverers/create-delivery-man.controller";
import { CreateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/create-delivery-man";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateDelivererController, 
    ConfirmDelivererPasswordResetController,
    CreateDelivererController
  ],
  providers: [
    AuthenticateDelivererUseCase, 
    ConfirmDelivererPasswordResetUseCase,
    CreateDelivererUseCase
  ]
})
export class DelivererModule {}