/**
 * Usage: npx tsx scripts/make-admin.ts <email>
 *
 * Sets the specified user's role to ADMIN in the database.
 * Run this once to grant admin access to your account.
 *
 * Example:
 *   npx tsx scripts/make-admin.ts harsh.homespun@gmail.com
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: npx tsx scripts/make-admin.ts <email>')
    process.exit(1)
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
    select: { id: true, email: true, name: true, role: true },
  })

  console.log(`✅ ${user.email} (${user.name}) is now an ADMIN`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
