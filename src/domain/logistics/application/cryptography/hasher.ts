export abstract class Hasher {
  abstract compare(plain: string, hashed: string): Promise<boolean>
  abstract hash(plain: string): Promise<string>
}