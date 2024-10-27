import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RegisterAdminController } from "./register-admin.controller";
import { RegisterAdminUseCase } from "@/domain/logistics/application/use-cases/admin/register-admin";
import { DatabaseModule } from "@/infra/database/database.module";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { MailerModule } from "@/infra/mailer/mailer.module";

@Module({
  imports: [DatabaseModule, CryptographyModule, MailerModule],
  controllers: [
    RegisterAdminController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    RegisterAdminUseCase
  ]
})
export class AdminsModule {}