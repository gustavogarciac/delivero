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

  get status() {
    return this.props.status;
  }
  
  get role() {
    return this.props.role;
  }

  isAdmin() {
    if (!this.props.role) {
      return false;
    }
    return this.props.role.isAdmin();
  }

  protected constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
    // Não precisa reatribuir _id e props novamente, pois já é feito na superclasse.
  }
}