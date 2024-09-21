<<<<<<< HEAD
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";
import { Injectable } from "@nestjs/common";
=======
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";
>>>>>>> 037abf3 (feat: env module)

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
<<<<<<< HEAD
    return this.configService.get(key, { infer: true });
=======
    return this.configService.get(key, { infer: true })
>>>>>>> 037abf3 (feat: env module)
  }
}