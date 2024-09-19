import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from "@nestjs/config"
import { AppService } from './app.service';
import { envSchema } from './env';
import { AuthenticateController } from './controllers/authenticate-controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [AppController, AuthenticateController],
  providers: [AppService]
})
export class AppModule {}
