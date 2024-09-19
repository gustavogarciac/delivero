import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from "@nestjs/config"
import { AppService } from './app.service';
import { envSchema } from './env';
import { AuthenticateController } from './controllers/authenticate-controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
    DatabaseModule
  ],
  controllers: [AppController, AuthenticateController],
  providers: [AppService]
})
export class AppModule {}
