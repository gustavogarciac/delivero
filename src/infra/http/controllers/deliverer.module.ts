import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { AuthenticateDelivererController } from "./deliverers/authenticate-deliverer.controller";
import { ConfirmDelivererPasswordResetController } from "./deliverers/confirm-deliverer-password-reset.controller";
import { ConfirmDelivererPasswordResetUseCase } from "@/domain/logistics/application/use-cases/deliverer/confirm-deliverer-password-reset";
import { CreateDelivererController } from "./deliverers/create-delivery-man.controller";
import { CreateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/create-delivery-man";
import { DeleteDelivererController } from "./deliverers/delete-deliverer.controller";
import { DeleteDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/delete-delivery-man";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateDelivererController, 
    ConfirmDelivererPasswordResetController,
    CreateDelivererController,
    DeleteDelivererController
  ],
  providers: [
    AuthenticateDelivererUseCase, 
    ConfirmDelivererPasswordResetUseCase,
    CreateDelivererUseCase,
    DeleteDelivererUseCase
  ]
})
export class DelivererModule {}