import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  DELIVERO_DB_USER: z.string(),
  DELIVERO_DB_PASSWORD: z.string(),
  DELIVERO_DB_NAME: z.string(),
  DELIVERO_DB_PORT: z.coerce.number(),
})

export type Env = z.infer<typeof envSchema>