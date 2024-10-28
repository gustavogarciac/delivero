import { DomainEvents } from "@/core/events/domain-events"
import { PrismaClient } from "@prisma/client"
import { execSync } from "node:child_process"
import { config } from "dotenv"
import { randomUUID } from "node:crypto"

const envFile = process.env.NODE_ENV === 'test' ? './.env.test' : './.env'

config({ path: envFile, override: true })

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
