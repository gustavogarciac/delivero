import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { ConfirmRecipientPasswordResetController } from "./confirm-recipient-password-reset.controller";
import { ConfirmRecipientPasswordResetUseCase } from "@/domain/logistics/application/use-cases/recipient/confirm-recipient-password-reset";
import { DeleteRecipientController } from "./delete-recipient.controller";
import { DeleteRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/delete-recipient";
import { GetRecipientAwaitingPickupOrdersController } from "./get-recipient-awaiting-pickup-orders.controller";
import { GetRecipientAwaitingPickupOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-awaiting-pickup-orders";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { GetRecipientDeliveredOrdersController } from "./get-recipient-delivered-orders.controller";
import { GetRecipientDeliveredOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-delivered-orders";
import { GetRecipientInTransitOrdersController } from "./get-recipient-in-transit-orders.controller";
import { GetRecipientInTransitOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-in-transit-orders";
import { GetRecipientReturnedOrdersController } from "./get-recipient-returned-orders.controller";
import { GetRecipientReturnedOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-returned-orders";
import { GetRecipientPreparingOrdersController } from "./get-recipient-preparing-orders.controller";
import { GetRecipientPreparingOrdersUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-preparing-orders";
import { GetRecipientDetailsController } from "./get-recipient-details.controller";
import { GetRecipientDetailsUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipient-details";
import { GetRecipientsController } from "./get-recipients.controller";
import { GetRecipientsUseCase } from "@/domain/logistics/application/use-cases/recipient/get-recipients";
import { RegisterRecipientController } from "./register-recipient.controller";
import { RegisterRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/register-recipient";
import { ResetRecipientPasswordController } from "./reset-recipient-password.controller";
import { ResetRecipientPasswordUseCase } from "@/domain/logistics/application/use-cases/recipient/reset-recipient-password";
import { MailerModule } from "@/infra/mailer/mailer.module";
import { UpdateRecipientController } from "./update-recipient.controller";
import { UpdateRecipientUseCase } from "@/domain/logistics/application/use-cases/recipient/update-recipient";

@Module({
  imports: [DatabaseModule, CryptographyModule, MailerModule],
  controllers: [
    ConfirmRecipientPasswordResetController,
    DeleteRecipientController,
    GetRecipientAwaitingPickupOrdersController,
    GetRecipientDeliveredOrdersController,
    GetRecipientInTransitOrdersController,
    GetRecipientReturnedOrdersController,
    GetRecipientPreparingOrdersController,
    GetRecipientDetailsController,
    GetRecipientsController,
    RegisterRecipientController,
    ResetRecipientPasswordController,
    UpdateRecipientController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    ConfirmRecipientPasswordResetUseCase,
    DeleteRecipientUseCase,
    GetRecipientAwaitingPickupOrdersUseCase,
    GetRecipientDeliveredOrdersUseCase,
    GetRecipientInTransitOrdersUseCase,
    GetRecipientReturnedOrdersUseCase,
    GetRecipientPreparingOrdersUseCase,
    GetRecipientDetailsUseCase,
    GetRecipientsUseCase,
    RegisterRecipientUseCase,
    ResetRecipientPasswordUseCase,
    UpdateRecipientUseCase
  ]
})
export class RecipientModule {}