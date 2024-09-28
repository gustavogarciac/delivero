import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
import { Permissions } from "./permissions/admin";

export interface AdminProps {
  permissions: Permissions;
}

export class Admin extends User {
  private adminProps: AdminProps;

  get permissions() {
    return this.adminProps.permissions;
  }

  protected constructor(userProps: UserProps, adminProps: AdminProps, id?: UniqueEntityId) {
    super(userProps, id); // Passa as propriedades de User para a superclasse
    this.adminProps = adminProps; // Armazena as propriedades específicas do Admin
  }

  static create(adminProps: AdminProps, userProps: UserProps, id?: UniqueEntityId) {
    return new Admin(userProps, adminProps, id);
  }
}