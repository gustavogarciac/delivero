enum Roles {
  ADMIN = 'admin',
  DELIVERER = 'deliverer',
}

export class Role {
  private type: Roles;

  isAdmin() {
    return this.type === Roles.ADMIN;
  }

  constructor(type: "admin" | "deliverer") {
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