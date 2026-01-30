import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { logger } from './logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Create connection pool
if (!globalForPrisma.pool) {
  const url = process.env.DATABASE_URL
  if (!url) {
    logger.error({}, 'DATABASE_URL is not set')
    throw new Error('DATABASE_URL is not set')
  }

  logger.info('Creating Prisma connection pool')
  globalForPrisma.pool = new Pool({
    connectionString: url,
    max: 1, // Recommended for Vercel serverless functions
  })
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

globalForPrisma.prisma = prisma
