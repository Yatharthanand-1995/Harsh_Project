import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { PRODUCTS } from '../src/data/products'

async function main() {
  console.log('🌱 Starting database seed...')

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
      update: {},
      create: {
        name: 'Celebration Cakes',
        slug: 'cakes',
        description: 'Custom celebration cakes for every occasion',
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'festivals' },
      update: {},
      create: {
        name: 'Festival Gifts',
        slug: 'festivals',
        description: 'Special gift hampers for festivals and celebrations',
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
      update: {},
      create: {
        name: 'Frozen & Ready to Consume',
        slug: 'frozen',
        description: 'Frozen products ready to heat and eat',
        order: 5,
        isActive: true,
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

  console.log(`✅ Created ${categories.length} categories`)

  // Create products
  console.log('Creating products...')
  let productCount = 0

  for (const product of PRODUCTS) {
    const categoryId = categoryMap[product.category]
    if (!categoryId) {
      throw new Error(`Category "${product.category}" not found for product "${product.name}"`)
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
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
        festivalType: (product as any).festivalType ?? null,
        isActive: true,
      },
    })
    productCount++
  }

  console.log(`✅ Created ${productCount} products`)

  // Create test user
  console.log('Creating test user...')
  const passwordHash = await bcrypt.hash('password123', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'test@homespun.com' },
    update: {},
    create: {
      email: 'test@homespun.com',
      name: 'Test User',
      phone: '+91 9876543210',
      passwordHash,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })

  console.log(`✅ Created test user: ${testUser.email}`)
  console.log(`   Password: password123`)

  // Create admin user
  console.log('Creating admin user...')
  const adminPasswordHash = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@homespun.com' },
    update: {},
    create: {
      email: 'admin@homespun.com',
      name: 'Admin User',
      phone: '+91 9876543211',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)
  console.log(`   Password: admin123`)

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('Test Credentials:')
  console.log('─────────────────')
  console.log('Customer: test@homespun.com / password123')
  console.log('Admin:    admin@homespun.com / admin123')
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
