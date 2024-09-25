export class Permissions {
  private permissions: Set<string>;

  has(permission: string): boolean {
    return this.permissions.has(permission);
  }

  getAll(): string[] {
    return Array.from(this.permissions);
  }

  constructor(permissions: string[]) {
    this.permissions = new Set(permissions);
  }
}