import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DeliverersRepository } from '@/domain/logistics/application/repositories/deliverers-repository';
import { PrismaDeliverersRepository } from './prisma/repositories/prisma-deliverers-repository';
import { DelivererTokenRepository } from '@/domain/logistics/application/repositories/deliverer-tokens-repository';
import { PrismaDelivererTokenMapper } from './prisma/mappers/prisma-deliverer-token-mapper';
import { PrismaDelivererTokensRepository } from './prisma/repositories/prisma-deliverer-tokens-repository';

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
    }
  ],
  exports: [PrismaService, DeliverersRepository, DelivererTokenRepository],
})
export class DatabaseModule {}