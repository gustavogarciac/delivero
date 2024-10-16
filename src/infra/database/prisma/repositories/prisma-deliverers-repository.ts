import { DeliverersRepository } from "@/domain/logistics/application/repositories/deliverers-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PaginationParams } from "@/core/repositories/pagination";
import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer";
import { PrismaDelivererMapper } from "../mappers/prisma-deliverer-mapper";

@Injectable()
export class PrismaDeliverersRepository implements DeliverersRepository {
  constructor(private prisma: PrismaService) {}
  async findByCpf(cpf: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.deliverer.findUnique({
      where: {
        cpf
      },
      include: {
        orders: true,
        vehicles: true
      }
    })

    if(!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }
  findById(id: string): Promise<Deliverer | null> {
    throw new Error("Method not implemented.");
  }
  findMany(params: PaginationParams): Promise<{ items: Deliverer[]; total?: number; }> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<Deliverer | null> {
    throw new Error("Method not implemented.");
  }
  create(deliverer: Deliverer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(deliverer: Deliverer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(deliverer: Deliverer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  incrementDeliveriesCount(delivererId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}