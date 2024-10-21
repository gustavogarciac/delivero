import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

export async function seed() {
  console.log('Seed function called')

  const prisma = new PrismaClient()

  await prisma.deliverer.create({
    data: {
      cpf: '04564349090',
      name: 'John Doe',
      email: "johndoe@email.com",
      latitude: 0,
      longitude: 0,
      password: await hash('123456789', 8),
      phone: '99999999999',
      deliveriesCount: 0,
    }
  })


  await prisma.$disconnect()
}

seed()