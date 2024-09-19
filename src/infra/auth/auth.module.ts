import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      async useFactory(env: EnvService) {
        const privateKey = env.get("JWT_PRIVATE_KEY")
        const publicKey = env.get("JWT_PUBLIC_KEY")

        return {
          signOptions: { algorithm: "RS256" },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      }
    })
  ],
  providers: [EnvService]
})
export class AuthModule {
}