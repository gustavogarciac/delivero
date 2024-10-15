import { DeliverersRepository } from "@/domain/logistics/application/repositories/deliverers-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PaginationParams } from "@/core/repositories/pagination";
import { Deliverer } from "@/domain/logistics/enterprise/entities/deliverer";

@Injectable()
export class PrismaDeliverersRepository implements DeliverersRepository {
  constructor(private prisma: PrismaService) {}
  findByCpf(cpf: string): Promise<Deliverer | null> {
    throw new Error("Method not implemented.");
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