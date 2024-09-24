import { Hasher } from '@/domain/logistics/application/cryptography/hasher'

export class FakeHasher implements Hasher {
  async hash(plain: string): Promise<string> {
    return plain.concat('hashed')
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const equals = plain.concat('hashed') === hashed

    return equals
  }
}