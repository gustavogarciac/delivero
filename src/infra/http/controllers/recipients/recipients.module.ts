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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    ConfirmRecipientPasswordResetController,
    DeleteRecipientController,
    GetRecipientAwaitingPickupOrdersController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    ConfirmRecipientPasswordResetUseCase,
    DeleteRecipientUseCase,
    GetRecipientAwaitingPickupOrdersUseCase
  ]
})
export class RecipientModule {}