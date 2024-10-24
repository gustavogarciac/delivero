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
import { FetchDeliverersController } from "./deliverers/fetch-deliverer.controller";
import { FetchDeliverersUseCase } from "@/domain/logistics/application/use-cases/deliverer/fetch-delivery-men";
import { GetDelivererProfileController } from "./deliverers/get-deliverer-profile.controller";
import { GetDelivererProfileUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-delivery-man-profile";
import { GetNearOrdersController } from "./deliverers/get-near-orders.controller";
import { GetNearOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-near-orders";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateDelivererController,
    ConfirmDelivererPasswordResetController,
    CreateDelivererController,
    DeleteDelivererController,
    FetchDeliverersController,
    GetDelivererProfileController,
    GetNearOrdersController
  ],
  providers: [
    AuthenticateDelivererUseCase,
    ConfirmDelivererPasswordResetUseCase,
    CreateDelivererUseCase,
    DeleteDelivererUseCase,
    FetchDeliverersUseCase,
    GetDelivererProfileUseCase,
    GetNearOrdersUseCase
  ]
})
export class DelivererModule {}