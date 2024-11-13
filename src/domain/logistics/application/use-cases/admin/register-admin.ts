import { Either, left, right } from "@/core/either"
import { Admin } from "../../../enterprise/entities/admin"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"
import { Permissions } from "@/domain/logistics/enterprise/entities/permissions/admin"
import { AdminsRepository } from "../../repositories/admins-repository"
import { Status } from "@/domain/logistics/enterprise/entities/user"
import { Injectable } from "@nestjs/common"

interface RegisterAdminUseCaseRequest {
  name: string
  password?: string | null
  email: string
  phone: string
}

type RegisterAdminUseCaseResponse = Either<BadRequestError, { admin: Admin }>

@Injectable()
export class RegisterAdminUseCase {
  constructor(private adminsRepository: AdminsRepository, private hasher: Hasher) {}

  async execute({
    name,
    password,
    email,
    phone
  } : RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    // TODO: Validade if cpf is already registered in the system overall
    const adminWithExistingEmail = await this.adminsRepository.findByEmail(email)

    if(adminWithExistingEmail) {
      return left(new BadRequestError)
    }

    const admin = Admin.create({
      permissions: Permissions.admin(),
    }, {
      name,
      password: password ? await this.hasher.hash(password) : null,
      status: Status.ACTIVE,
      email,
      phone,
    })

    await this.adminsRepository.create(admin)

    return right({ admin })
  }
}