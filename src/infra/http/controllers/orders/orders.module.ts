import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { MailerModule } from "@/infra/mailer/mailer.module";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderUseCase } from "@/domain/logistics/application/use-cases/orders/create-order";

@Module({
  imports: [DatabaseModule, CryptographyModule, MailerModule],
  controllers: [
    CreateOrderController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    CreateOrderUseCase
  ]
})
export class OrdersModule {}