import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { ConfirmRecipientPasswordResetController } from "./confirm-recipient-password-reset.controller";
import { ConfirmRecipientPasswordResetUseCase } from "@/domain/logistics/application/use-cases/recipient/confirm-recipient-password-reset";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    ConfirmRecipientPasswordResetController
  ],
  providers: [
    ConfirmRecipientPasswordResetUseCase
  ]
})
export class RecipientModule {}