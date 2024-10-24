import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DeliverersRepository } from '@/domain/logistics/application/repositories/deliverers-repository';
import { PrismaDeliverersRepository } from './prisma/repositories/prisma-deliverers-repository';
import { DelivererTokenRepository } from '@/domain/logistics/application/repositories/deliverer-tokens-repository';
import { PrismaDelivererTokensRepository } from './prisma/repositories/prisma-deliverer-tokens-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { OrdersRepository } from '@/domain/logistics/application/repositories/orders-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: DeliverersRepository,
      useClass: PrismaDeliverersRepository
    },
    {
      provide: DelivererTokenRepository, 
      useClass: PrismaDelivererTokensRepository
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository
    }
  ],
  exports: [PrismaService, DeliverersRepository, DelivererTokenRepository, OrdersRepository],
})
export class DatabaseModule {}