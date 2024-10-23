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
        vehicle: true
      }
    })

    if(!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }
  async findById(id: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.deliverer.findUnique({
      where: {
        id
      },
      include: {
        orders: true,
        vehicle: true
      }
    })

    if(!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }
  async findMany(params: PaginationParams): Promise<{ items: Deliverer[]; total?: number; }> {
    const { page, perPage, count, query } = params

    if(query) {
      const deliverers = await this.prisma.deliverer.findMany({
        where: {
          name: {
            contains: query
          }
        },
        include: {
          orders: true,
          vehicle: true
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          registeredAt: "desc"
        }
      })

      return {
        items: deliverers.map(PrismaDelivererMapper.toDomain),
        total: count ? deliverers.length : undefined
      }
    }
    
    const deliverers = await this.prisma.deliverer.findMany({
      include: {
        orders: true,
        vehicle: true
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return {
      items: deliverers.map(PrismaDelivererMapper.toDomain),
      total: count ? deliverers.length : undefined
    }

    // return this.prisma.deliverer.findMany({
    //   where: {
    //     name: {
    //       contains: query
    //     }
    //   },
    //   include: {
    //     orders: true,
    //     vehicle: true
    //   },
    //   skip: (page - 1) * perPage,
    //   take: perPage,
    //   orderBy: {
    //     registeredAt: "desc"
    //   }
    // }).then(deliverers => {
    //   return {
    //     items: deliverers.map(PrismaDelivererMapper.toDomain),
    //     total: count ? deliverers.length : undefined
    //   }
    // })
  }
  async findByEmail(email: string): Promise<Deliverer | null> {
    const deliverer = await this.prisma.deliverer.findUnique({
      where: {
        email
      },
      include: {
        orders: true,
        vehicle: true
      }
    })

    if(!deliverer) {
      return null
    }

    return PrismaDelivererMapper.toDomain(deliverer)
  }
  async create(deliverer: Deliverer): Promise<void> {
    await this.prisma.deliverer.create({
      data: PrismaDelivererMapper.toPersistence(deliverer)
    })
  }
  async delete(deliverer: Deliverer): Promise<void> {
    await this.prisma.deliverer.delete({
      where: {
        id: deliverer.id.toString()
      }
    })
  }
  async save(deliverer: Deliverer): Promise<void> {
    await this.prisma.deliverer.update({
      where: {
        id: deliverer.id.toString()
      },
      data: PrismaDelivererMapper.toPersistence(deliverer)
    })
  }
  async incrementDeliveriesCount(delivererId: string): Promise<void> {
    await this.prisma.deliverer.update({
      where: {
        id: delivererId
      },
      data: {
        deliveriesCount: {
          increment: 1
        }
      }
    })
  }
}