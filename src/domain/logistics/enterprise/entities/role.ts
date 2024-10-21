export enum Roles {
  ADMIN = 'ADMIN',
  DELIVERER = 'DELIVERER',
  RECIPIENT = 'RECIPIENT',
}

export class Role {
  public type: Roles;

  isAdmin() {
    return this.type === Roles.ADMIN;
  }

  constructor(type: "ADMIN" | "DELIVERER") {
    switch (type) {
      case Roles.ADMIN:
        this.type = Roles.ADMIN;
        break;
      case Roles.DELIVERER:
        this.type = Roles.DELIVERER;
        break;
      default:
        throw new Error('Invalid role type');
    }
  }

  static admin() {
    return new Role(Roles.ADMIN);
  }
}