import { Module } from "@nestjs/common";
import { EnvService } from "./env.service";

@Module({
  providers: [EnvService],
<<<<<<< HEAD
  exports: [EnvService],
=======
  exports: [EnvService]
>>>>>>> 037abf3 (feat: env module)
})
export class EnvModule {}