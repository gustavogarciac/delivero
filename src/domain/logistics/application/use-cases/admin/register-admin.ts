import { Either, left, right } from "@/core/either"
import { Admin } from "../../../enterprise/entities/admin"
import { BadRequestError } from "@/core/errors/bad-request-error"
import { Cpf } from "../../../enterprise/entities/value-objects/cpf"
import { Hasher } from "../../cryptography/hasher"
import { Permissions } from "@/domain/logistics/enterprise/entities/permissions/admin"
import { AdminsRepository } from "../../repositories/admins-repository"
import { Status } from "@/domain/logistics/enterprise/entities/user"

interface RegisterAdminUseCaseRequest {
  cpf: string
  name: string
  password: string
  email: string
  phone: string
}

type RegisterAdminUseCaseResponse = Either<BadRequestError, { admin: Admin }>

export class RegisterAdminUseCase {
  constructor(private adminsRepository: AdminsRepository, private hasher: Hasher) {}

  async execute({
    cpf,
    name,
    password,
    email,
    phone
  } : RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const cpfIsValid = Cpf.isValid(cpf)

    if(!cpfIsValid) {
      return left(new BadRequestError)
    }

    // TODO: Validade if cpf is already registered in the system overall
    const adminWithExistingCpf = await this.adminsRepository.findByCpf(cpf)

    if(adminWithExistingCpf) {
      return left(new BadRequestError)
    }

    const admin = Admin.create({
      permissions: Permissions.admin(),
    }, {
      cpf: Cpf.create(cpf),
      name,
      password: await this.hasher.hash(password),
      status: Status.ACTIVE,
      email,
      phone,
    })

    await this.adminsRepository.create(admin)

    return right({ admin })
  }
}