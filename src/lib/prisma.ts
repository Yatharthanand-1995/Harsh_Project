import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { logger } from './logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// For Prisma Postgres URLs, extract the actual database URL from the API key
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) {
    logger.error({}, 'DATABASE_URL is not set')
    throw new Error('DATABASE_URL is not set')
  }

  // If it's a Prisma Postgres URL, we need to decode the API key
  if (url.startsWith('prisma+postgres://')) {
    try {
      const apiKeyMatch = url.match(/api_key=([^&]+)/)
      if (apiKeyMatch && apiKeyMatch[1]) {
        const apiKey = apiKeyMatch[1]
        const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString())
        logger.info('Using decoded Prisma Postgres URL')
        return decoded.databaseUrl
      }
    } catch (e) {
      logger.error(e instanceof Error ? e : { error: String(e) }, 'Failed to parse Prisma Postgres URL')
      // Fall back to the original URL
      return url
    }
  }

  logger.info('Using standard DATABASE_URL')
  return url
}

// Create connection pool
if (!globalForPrisma.pool) {
  const dbUrl = getDatabaseUrl()
  logger.info('Creating Prisma connection pool')
  globalForPrisma.pool = new Pool({
    connectionString: dbUrl,
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
