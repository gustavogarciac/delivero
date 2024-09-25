enum Roles {
  ADMIN = 'admin',
  DELIVERER = 'deliverer',
}

export class Role {
  private type: Roles;

  isAdmin() {
    return this.type === Roles.ADMIN;
  }

  constructor(type: Roles) {
    this.type = type;
  }

  static admin() {
    return new Role(Roles.ADMIN);
  }
}