export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
  abstract decrypt(token: string): Promise<Record<string, unknown>>
}