import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Admin, AdminProps } from "@/domain/logistics/enterprise/entities/admin";
import { Role } from "@/domain/logistics/enterprise/entities/role";
import { Status, UserProps } from "@/domain/logistics/enterprise/entities/user";
import { Cpf } from "@/domain/logistics/enterprise/entities/value-objects/cpf";
import { faker } from "@faker-js/faker";
import { Permissions } from "@/domain/logistics/enterprise/entities/permissions/admin";

export function makeAdmin(
  overrideAdminProps: Partial<AdminProps> = {},
  overrideUserProps: Partial<UserProps> = {},
  id?: UniqueEntityId
) {
  /* 
  * This function creates a Admin entity with the given properties.
  * If no properties are given, random values will be generated.
  */
  const admin = Admin.create(
    {
      permissions: Permissions.admin(),
      ...overrideAdminProps
    },
    {
      cpf: Cpf.create(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      registeredAt: faker.date.past(),
      role: new Role("ADMIN"),
      status: Status.ACTIVE,
      updatedAt: faker.date.past(),
      ...overrideUserProps
    },
    id
  )

  return admin
}