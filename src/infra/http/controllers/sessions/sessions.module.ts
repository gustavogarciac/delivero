import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
// import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { AuthenticateWithGoogleController } from "./authenticate-with-google.controller";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { AuthenticateWithGoogleUseCase } from "@/domain/logistics/application/use-cases/sessions/authenticate-with-google-use-case";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateWithGoogleController],
  providers: [AuthenticateWithGoogleUseCase]
})
export class SessionsModule {}