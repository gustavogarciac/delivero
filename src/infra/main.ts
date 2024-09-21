import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
=======
import { ConfigService } from '@nestjs/config';
import { Env } from './env/env';
>>>>>>> 037abf3 (feat: env module)
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  const envService = app.get(EnvService)
  const port = envService.get("PORT")
=======
  const configService = app.get(EnvService)
  const port = configService.get("PORT")
>>>>>>> 037abf3 (feat: env module)

  await app.listen(port);
}
bootstrap();
