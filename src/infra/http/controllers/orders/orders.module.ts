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
import { GetOrdersController } from "./get-orders.controller";
import { GetOrdersUseCase } from "@/domain/logistics/application/use-cases/orders/get-orders";
import { SetOrderAsAvailableToPickUpController } from "./set-order-as-available-to-pick-up.controller";
import { SetOrderAsAvailableToPickUpUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-available-to-pick-up";
import { SetOrderAsDeliveredController } from "./set-order-as-delivered.controller";
import { SetOrderAsDeliveredUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-delivered";
import { SetOrderAsPickedUpController } from "./set-order-as-picked-up.controller";
import { SetOrderAsPickedUpUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-picked-up";
import { SetOrderAsReturnedUseCase } from "@/domain/logistics/application/use-cases/orders/set-order-as-returned";
import { SetOrderAsReturnedController } from "./set-order-as-returned.controller";
import { StorageModule } from "@/infra/storage/storage.module";
import { EnvModule } from "@/infra/env/env.module";
import { UploadOrderAttachmentController } from "./upload-order-attachment.controller";
import { UploadOrderAttachmentUseCase } from "@/domain/logistics/application/use-cases/orders/upload-order-attachment";

@Module({
  imports: [DatabaseModule, CryptographyModule, MailerModule, StorageModule, EnvModule],
  controllers: [
    CreateOrderController,
    GetOrderDetailsController,
    GetOrdersController,
    SetOrderAsAvailableToPickUpController,
    SetOrderAsDeliveredController,
    SetOrderAsPickedUpController,
    SetOrderAsReturnedController,
    UploadOrderAttachmentController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    CreateOrderUseCase,
    GetOrderDetailsUseCase,
    GetOrdersUseCase,
    SetOrderAsAvailableToPickUpUseCase,
    SetOrderAsDeliveredUseCase,
    SetOrderAsPickedUpUseCase,
    SetOrderAsReturnedUseCase,
    UploadOrderAttachmentUseCase
  ]
})
export class OrdersModule {}