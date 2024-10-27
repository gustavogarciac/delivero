import { JwtAuthGuard } from "@/infra/auth/jwt-auth-guard";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { MailerModule } from "@/infra/mailer/mailer.module";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderUseCase } from "@/domain/logistics/application/use-cases/orders/create-order";
import { GetOrderDetailsUseCase } from "@/domain/logistics/application/use-cases/orders/get-order-details";
import { GetOrderDetailsController } from "./get-order-details.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule, MailerModule],
  controllers: [
    CreateOrderController,
    GetOrderDetailsController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    CreateOrderUseCase,
    GetOrderDetailsUseCase
  ]
})
export class OrdersModule {}