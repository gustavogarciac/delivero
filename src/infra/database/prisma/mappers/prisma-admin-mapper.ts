import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Admin } from "@/domain/logistics/enterprise/entities/admin";
import { Permissions } from "@/domain/logistics/enterprise/entities/permissions/admin";
import { Role } from "@/domain/logistics/enterprise/entities/role";
import { Status } from "@/domain/logistics/enterprise/entities/user";
import { Cpf } from "@/domain/logistics/enterprise/entities/value-objects/cpf";
import { Admin as PrismaAdmin, Prisma } from "@prisma/client";

export class PrismaAdminMapper {
  static toDomain(prismaAdmin: PrismaAdmin): Admin {
    const admin = Admin.create(
      {
        permissions: Permissions.admin(),
      }, 
      {
        cpf: Cpf.create(prismaAdmin.cpf),
        email: prismaAdmin.email,
        name: prismaAdmin.name,
        password: prismaAdmin.password,
        phone: prismaAdmin.phone,
        registeredAt: prismaAdmin.createdAt,
        role: new Role("ADMIN"),
        status: Status.ACTIVE,
        updatedAt: prismaAdmin.updatedAt,
      }, 
      new UniqueEntityId(prismaAdmin.id)
    )

    return admin
  }

  static toPersistence(admin: Admin): Prisma.AdminCreateInput {      
    return {
      id: admin.id.toString(),
      cpf: admin.cpf.value,
      password: admin.password,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      createdAt: admin.registeredAt ?? new Date(),
      updatedAt: admin.updatedAt ?? new Date(),
    }
  }
}