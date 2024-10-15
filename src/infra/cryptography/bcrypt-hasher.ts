import { Hasher } from "@/domain/logistics/application/cryptography/hasher";
import { hash, compare } from "bcryptjs"

export class BcryptHasher implements Hasher {
  private readonly salt = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.salt)
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed)
  }
}