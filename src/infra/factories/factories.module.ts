import { Module } from "@nestjs/common";
import { DelivererFactory } from "test/factories/make-deliverer";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";
import { DatabaseModule } from "../database/database.module";

@Module({
  providers: [OrderFactory, RecipientFactory, DelivererFactory],
  exports: [OrderFactory, RecipientFactory, DelivererFactory],
  imports: [DatabaseModule]
})
export class FactoriesModule {}