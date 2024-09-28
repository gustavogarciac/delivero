import { Entity } from "@/core/entities/entity";
import { Cpf } from "./value-objects/cpf";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Role } from "./role";

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  cpf: Cpf;
  phone: string;
  registeredAt?: Date | null;
  updatedAt?: Date | null;
  status?: Status;
  role?: Role;
}

export abstract class User extends Entity<UserProps> {
  // A propriedade 'props' é acessível aqui através de 'this.props'
  
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get cpf() {
    return this.props.cpf;
  }

  get phone() {
    return this.props.phone;
  }

  get registeredAt() {
    return this.props.registeredAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get status(): Status | null {
    return this.props.status ?? null;
  }
  
  get role(): Role | null {
    return this.props.role ?? null;
  }

  isAdmin() {
    if (!this.props.role) {
      return false;
    }
    return this.props.role.isAdmin();
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  set cpf(cpf: Cpf) {
    this.props.cpf = cpf;
    this.touch();
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  set status(status: Status) {
    this.props.status = status;
    this.touch();
  }

  set role(role: Role) {
    this.props.role = role;
    this.touch();
  }

  touch() {
    this.props.updatedAt = new Date();
  }

  protected constructor(props: UserProps, id?: UniqueEntityId) {
    super({
      ...props,
      status: Status.INACTIVE
    }, id);
  }
}