import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle("API Docs (Delivero)")
    .setDescription("API Docs for Delivero")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    }

  const documentFactory = () => SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup("docs", app, documentFactory)

  const configService = app.get(EnvService)
  const port = configService.get("PORT")

  await app.listen(port);
}
bootstrap();
