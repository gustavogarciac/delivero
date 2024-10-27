import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DeliverersRepository } from '@/domain/logistics/application/repositories/deliverers-repository';
import { PrismaDeliverersRepository } from './prisma/repositories/prisma-deliverers-repository';
import { DelivererTokenRepository } from '@/domain/logistics/application/repositories/deliverer-tokens-repository';
import { PrismaDelivererTokensRepository } from './prisma/repositories/prisma-deliverer-tokens-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { OrdersRepository } from '@/domain/logistics/application/repositories/orders-repository';
import { RecipientsRepository } from '@/domain/logistics/application/repositories/recipients-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';
import { RecipientTokenRepository } from '@/domain/logistics/application/repositories/recipient-tokens-repository';
import { PrismaRecipientTokensRepository } from './prisma/repositories/prisma-recipient-tokens-repository';
import { AdminsRepository } from '@/domain/logistics/application/repositories/admins-repository';
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository';

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
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository
    },
    {
      provide: RecipientTokenRepository,
      useClass: PrismaRecipientTokensRepository
    },
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository
    }
  ],
  exports: [
    PrismaService, 
    DeliverersRepository, 
    DelivererTokenRepository, 
    OrdersRepository, 
    RecipientsRepository,
    RecipientTokenRepository,
    AdminsRepository
  ],
})
export class DatabaseModule {}