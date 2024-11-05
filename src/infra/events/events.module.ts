import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { OnOrderAwaitingPickup } from "@/domain/notification/subscribers/on-order-awaiting-pickup";
import { OnOrderCreated } from "@/domain/notification/subscribers/on-order-created";
import { OnOrderDelivered } from "@/domain/notification/subscribers/on-order-delivered";
import { OnOrderPickedUp } from "@/domain/notification/subscribers/on-order-picked-up";
import { OnOrderReturned } from "@/domain/notification/subscribers/on-order-returned";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderAwaitingPickup,
    OnOrderCreated,
    OnOrderDelivered,
    OnOrderPickedUp,
    OnOrderReturned,
    SendNotificationUseCase
  ],
})
export class EventsModule {}