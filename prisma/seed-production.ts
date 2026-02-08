import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { PRODUCTS } from '../src/data/products'

// Use production database URL
const productionUrl = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL

const pool = new Pool({
  connectionString: productionUrl,
  ssl: { rejectUnauthorized: false }
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting production database seed...')

  // Create categories
  console.log('Creating categories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'bakery' },
      update: {},
      create: {
        name: 'Artisan Bakery',
        slug: 'bakery',
        description: 'Fresh artisan breads, croissants, and pastries made daily',
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cakes' },
      update: { isActive: false },
      create: {
        name: 'Celebration Cakes',
        slug: 'cakes',
        description: 'Custom celebration cakes for every occasion',
        order: 2,
        isActive: false,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hampers' },
      update: { name: 'Hamper & Gift Sets', description: 'Curated gift hampers perfect for any occasion' },
      create: {
        name: 'Hamper & Gift Sets',
        slug: 'hampers',
        description: 'Curated gift hampers perfect for any occasion',
        order: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'corporate' },
      update: {},
      create: {
        name: 'Corporate Gifting',
        slug: 'corporate',
        description: 'Premium corporate gifts and hampers',
        order: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'frozen' },
      update: { isActive: false },
      create: {
        name: 'Frozen & Ready to Consume',
        slug: 'frozen',
        description: 'Frozen products ready to heat and eat',
        order: 5,
        isActive: false,
      },
    }),
  ])

  const categoryMap = categories.reduce(
    (acc, cat) => {
      acc[cat.slug] = cat.id
      return acc
    },
    {} as Record<string, string>
  )

  console.log(`✅ Created/Updated ${categories.length} categories`)

  // Create products
  console.log('Creating/Updating products...')
  let productCount = 0

  for (const product of PRODUCTS) {
    const categoryId = categoryMap[product.category]
    if (!categoryId) {
      throw new Error(`Category "${product.category}" not found for product "${product.name}"`)
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        shortDesc: product.shortDesc,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        categoryId,
        thumbnail: product.thumbnail,
        images: product.images,
        stock: product.stock,
        ingredients: product.ingredients ?? null,
        allergens: product.allergens ?? null,
        tags: product.tags ?? [],
        isFeatured: product.isFeatured ?? false,
        bakeryType: (product as any).bakeryType ?? null,
        festivalType: null,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDesc: product.shortDesc,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        categoryId,
        thumbnail: product.thumbnail,
        images: product.images,
        stock: product.stock,
        ingredients: product.ingredients ?? null,
        allergens: product.allergens ?? null,
        tags: product.tags ?? [],
        isFeatured: product.isFeatured ?? false,
        bakeryType: (product as any).bakeryType ?? null,
        festivalType: null,
        isActive: true,
      },
    })
    productCount++
  }

  console.log(`✅ Created/Updated ${productCount} products`)

  console.log('')
  console.log('🎉 Production database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
