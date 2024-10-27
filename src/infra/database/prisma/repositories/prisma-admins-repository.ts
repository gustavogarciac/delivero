import { AdminsRepository } from "@/domain/logistics/application/repositories/admins-repository";
import { PrismaService } from "../prisma.service";
import { Admin } from "@/domain/logistics/enterprise/entities/admin";
import { Order } from "@/domain/logistics/enterprise/entities/order";
import { PrismaAdminMapper } from "../mappers/prisma-admin-mapper";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        cpf
      }
    })

    if(!admin) return null
    
    return PrismaAdminMapper.toDomain(admin)
  }
  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id
      }
    })

    if(!admin) return null
    
    return PrismaAdminMapper.toDomain(admin)
  }
  async create(admin: Admin): Promise<void> {
    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPersistence(admin)
    })
  }
  async setDelivererAsActive(delivererId: string): Promise<void> {
    const deliverer = await this.prisma.deliverer.findUnique({
      where: {
        id: delivererId
      }
    })

    if(!deliverer) throw new Error("Deliverer not found")

    await this.prisma.deliverer.update({
      where: {
        id: delivererId
      },
      data: {
        status: "ACTIVE"
      }
    })
  }
  async attendOrderToDeliverer(order: Order, delivererId: string): Promise<void> {
    const delirerer = await this.prisma.deliverer.findUnique({
      where: {
        id: delivererId
      }
    })

    if(!delirerer) throw new Error("Deliverer not found")

    await this.prisma.order.update({
      where: {
        id: order.id.toString()
      },
      data: {
        delivererId
      }
    })

    await this.prisma.deliverer.update({
      where: {
        id: delivererId
      },
      data: {
        orders: {
          create: PrismaOrderMapper.toPersistence(order)
        }
      }
    })
  }
}