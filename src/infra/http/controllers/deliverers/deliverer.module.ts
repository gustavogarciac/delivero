import { AuthenticateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/authenticate-deliverer";
import { ConfirmDelivererPasswordResetUseCase } from "@/domain/logistics/application/use-cases/deliverer/confirm-deliverer-password-reset";
import { CreateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/create-delivery-man";
import { DeleteDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/delete-delivery-man";
import { FetchDeliverersUseCase } from "@/domain/logistics/application/use-cases/deliverer/fetch-delivery-men";
import { GetDelivererProfileUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-delivery-man-profile";
import { GetNearOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/get-near-orders";
import { ListOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/list-orders";
import { ListPendingOrdersUseCase } from "@/domain/logistics/application/use-cases/deliverer/list-pending-orders";
import { ResetDelivererPasswordUseCase } from "@/domain/logistics/application/use-cases/deliverer/reset-password";
import { UpdateDelivererUseCase } from "@/domain/logistics/application/use-cases/deliverer/update-deliverer";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { MailerModule } from "@/infra/mailer/mailer.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticateDelivererController } from "./authenticate-deliverer.controller";
import { ConfirmDelivererPasswordResetController } from "./confirm-deliverer-password-reset.controller";
import { CreateDelivererController } from "./create-delivery-man.controller";
import { DeleteDelivererController } from "./delete-deliverer.controller";
import { FetchDeliverersController } from "./fetch-deliverer.controller";
import { GetDelivererProfileController } from "./get-deliverer-profile.controller";
import { GetNearOrdersController } from "./get-near-orders.controller";
import { ListDelivererOrdersController } from "./list-deliverer-orders.controller";
import { ListDelivererPendingOrdersController } from "./list-deliverer-pending-orders.controller";
import { ResetDelivererPasswordController } from "./reset-deliverer-password.controller";
import { UpdateDelivererController } from "./update-deliverer.controller";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module";


@Module({
  imports: [DatabaseModule, CryptographyModule, MailerModule],
  controllers: [
    AuthenticateDelivererController,
    ConfirmDelivererPasswordResetController,
    CreateDelivererController,
    DeleteDelivererController,
    FetchDeliverersController,
    GetDelivererProfileController,
    GetNearOrdersController,
    ListDelivererOrdersController,
    ListDelivererPendingOrdersController,
    ResetDelivererPasswordController,
    UpdateDelivererController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    AuthenticateDelivererUseCase,
    ConfirmDelivererPasswordResetUseCase,
    CreateDelivererUseCase,
    DeleteDelivererUseCase,
    FetchDeliverersUseCase,
    GetDelivererProfileUseCase,
    GetNearOrdersUseCase,
    ListOrdersUseCase,
    ListPendingOrdersUseCase,
    ResetDelivererPasswordUseCase,
    UpdateDelivererUseCase
  ]
})
export class DelivererModule {}