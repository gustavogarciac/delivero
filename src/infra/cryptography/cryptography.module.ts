import { Encrypter } from "@/domain/logistics/application/cryptography/encrypter";
import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter";
import { Hasher } from "@/domain/logistics/application/cryptography/hasher";
import { BcryptHasher } from "./bcrypt-hasher";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter
    }, {
      provide: Hasher,
      useClass: BcryptHasher
    }
  ],
  exports: [Encrypter, Hasher]
})
export class CryptographyModule {}