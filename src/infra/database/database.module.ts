import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DeliverersRepository } from '@/domain/logistics/application/repositories/deliverers-repository';
import { PrismaDeliverersRepository } from './prisma/repositories/prisma-deliverers-repository';

@Module({
  providers: [PrismaService, {
    provide: DeliverersRepository,
    useClass: PrismaDeliverersRepository
  }],
  exports: [PrismaService, DeliverersRepository],
})
export class DatabaseModule {}