const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function updateAdmin() {
  const hash = await bcrypt.hash('Monu860@', 10)

  // Upsert or update monuahirwar556 user
  const user = await prisma.user.upsert({
    where: { email: 'monuahirwar556@gmail.com' },
    update: {
      name: 'monuahirwar556',
      password: hash,
      role: 'ADMIN',
    },
    create: {
      email: 'monuahirwar556@gmail.com',
      name: 'monuahirwar556',
      password: hash,
      role: 'ADMIN',
    },
  })

  // Also update any other admin account with this password
  await prisma.user.updateMany({
    where: { role: 'ADMIN' },
    data: { password: hash },
  })

  console.log('✅ Admin credentials updated successfully:')
  console.log({
    username: user.name,
    email: user.email,
    password: 'Monu860@',
    role: user.role,
  })
}

updateAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
