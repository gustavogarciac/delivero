import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { envSchema } from './env/env';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
