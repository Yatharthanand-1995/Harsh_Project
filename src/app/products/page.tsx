import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Pagination, ResultsInfo } from '@/components/pagination'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { PAGINATION } from '@/lib/constants'
import {
  BAKERY_TYPE_NAMES,
  BakeryType,
} from '@/data/products'

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    featured?: string
    festival?: string
    bakeryType?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { category, search, featured, festival, bakeryType, page } = params

  // Parse and validate page number (prevent abuse with max limit)
  const MAX_PAGE = 1000
  const pageNum = parseInt(page || '1', 10)
  const currentPage = Math.max(1, Math.min(pageNum, MAX_PAGE))
  const perPage = PAGINATION.DEFAULT_PAGE_SIZE

  // Build Prisma where clause based on filters (type-safe)
  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(festival && { festivalType: festival }),
    ...(bakeryType && { bakeryType }),
    ...(featured === 'true' && { isFeatured: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { shortDesc: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  // Optimized: Run all queries in parallel with Promise.all (reduced from 8 to 7 queries)
  const [
    totalCount,
    filteredProducts,
    allProductsCount,
    bakeryCount,
    hampersCount,
    frozenCount,
    availableBakeryTypes,
  ] = await Promise.all([
    // Query 1: Get total count for pagination
    prisma.product.count({ where }),

    // Query 2: Fetch products with category
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (Math.max(1, currentPage) - 1) * perPage,
      take: perPage,
    }),

    // Query 3-6: Category counts in parallel
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, category: { slug: 'bakery', isActive: true } } }),
    prisma.product.count({ where: { isActive: true, category: { slug: 'hampers', isActive: true } } }),
    prisma.product.count({ where: { isActive: true, category: { slug: 'frozen', isActive: true } } }),

    // Query 7: Get available bakery types
    prisma.product.findMany({
      where: {
        isActive: true,
        bakeryType: { not: null },
      },
      select: {
        bakeryType: true,
      },
      distinct: ['bakeryType'],
    }),
  ])

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / perPage)

  // Note: Removed availableFestivals as festivalType was removed from the schema
  const availableFestivals: any[] = []

  const categoryTitle = {
    bakery: 'Artisan Bakery',
    hampers: 'Hamper & Gift Sets',
    corporate: 'Corporate Gifting',
    frozen: 'Frozen & Ready to Consume',
  }

  // Determine page title
  let pageTitle = 'All Products'
  if (bakeryType) {
    pageTitle = `${BAKERY_TYPE_NAMES[bakeryType as BakeryType]}`
  } else if (category) {
    pageTitle = categoryTitle[category as keyof typeof categoryTitle]
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Bakery Category Hero */}
        {category === 'bakery' && (
          <section className="relative h-96 overflow-hidden mb-12">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80"
                fill
                className="object-cover brightness-75"
                alt="Fresh baked goods"
                sizes="100vw"
                priority
              />
            </div>
            <div className="relative z-10 container mx-auto h-full flex items-center px-4">
              <div className="max-w-2xl text-white">
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 drop-shadow-2xl">
                  Artisan Bakery
                </h1>
                <p className="text-xl leading-relaxed drop-shadow-md">
                  Fresh-baked daily with love and traditional techniques
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Hampers Category Hero */}
        {category === 'hampers' && (
          <section className="relative h-96 overflow-hidden mb-12">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1605811345115-f4c2d8dea51a?w=1920&q=80"
                fill
                className="object-cover"
                alt="Gift hampers and sets"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--deep-red))]/90 to-[hsl(var(--saffron))]/80" />
            </div>
            <div className="relative z-10 container mx-auto h-full flex items-center px-4">
              <div className="max-w-2xl text-white">
                <h1 className="font-serif text-6xl lg:text-7xl font-black mb-4 drop-shadow-2xl">
                  Hamper & Gift Sets
                </h1>
                <p className="text-xl leading-relaxed drop-shadow-md">
                  Curated gift collections perfect for any occasion
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="container mx-auto px-4 py-12">
          {/* Page Header - Only show for non-hero categories */}
          {category !== 'bakery' && category !== 'hampers' && (
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--sienna))]">
                {pageTitle}
              </h1>
              <p className="text-lg text-gray-600">
                Handcrafted with love, delivered with care
              </p>
            </div>
          )}

          {/* Filters - Enhanced with gradient background */}
          <div className="bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] -mx-4 px-4 sm:mx-0 sm:rounded-3xl py-8 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href="/products"
                  className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all ${
                    !category
                      ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] shadow-lg scale-105'
                      : 'bg-white text-[hsl(var(--sienna))] hover:shadow-md hover:scale-102'
                  }`}
                >
                  All ({allProductsCount})
                </Link>
                <Link
                  href="/products?category=bakery"
                  className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all ${
                    category === 'bakery'
                      ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] shadow-lg scale-105'
                      : 'bg-white text-[hsl(var(--sienna))] hover:shadow-md hover:scale-102'
                  }`}
                >
                  🥖 Bakery ({bakeryCount})
                </Link>
                <Link
                  href="/products?category=hampers"
                  className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all ${
                    category === 'hampers'
                      ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] shadow-lg scale-105'
                      : 'bg-white text-[hsl(var(--sienna))] hover:shadow-md hover:scale-102'
                  }`}
                >
                  🎁 Hampers ({hampersCount})
                </Link>
                {/* Only show Frozen tab if there are products */}
                {frozenCount > 0 && (
                  <Link
                    href="/products?category=frozen"
                    className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all ${
                      category === 'frozen'
                        ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] shadow-lg scale-105'
                        : 'bg-white text-[hsl(var(--sienna))] hover:shadow-md hover:scale-102'
                    }`}
                  >
                    🧊 Frozen ({frozenCount})
                  </Link>
                )}
              </div>

              <p className="text-gray-600 font-medium">
                {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}
              </p>
            </div>
          </div>

          {/* Bakery Sub-Filters */}
          {(category === 'bakery' || bakeryType) && availableBakeryTypes.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                Browse by Type
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products?category=bakery"
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    category === 'bakery' && !bakeryType
                      ? 'bg-[hsl(var(--saffron))] text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  All Bakery
                </Link>
                {availableBakeryTypes.map((type) => {
                  if (!type.bakeryType) return null
                  return (
                    <Link
                      key={type.bakeryType}
                      href={`/products?category=bakery&bakeryType=${type.bakeryType}`}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                        bakeryType === type.bakeryType
                          ? 'bg-[hsl(var(--saffron))] text-white shadow-md scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      {BAKERY_TYPE_NAMES[type.bakeryType as BakeryType]}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}


          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            {/* Featured Products Bento (First 6 products) */}
            {filteredProducts.length >= 6 && (() => {
              const [p1, p2, p3, p4, p5, p6] = filteredProducts
              if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) return null

              return (
                <div className="mb-16">
                  <h2 className="text-4xl font-serif font-bold text-[hsl(var(--sienna))] mb-8">
                    Featured {category === 'bakery' ? 'Baked Goods' : category === 'hampers' ? 'Gift Sets' : 'Products'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[250px]">
                    {/* First product - Large (2x2) */}
                    <Link
                      href={`/products/${p1.slug}`}
                      className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 group relative overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={p1.thumbnail}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p1.name}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-3xl font-serif font-bold mb-2">
                          {p1.name}
                        </h3>
                        <p className="text-xl font-bold">₹{p1.price}</p>
                      </div>
                      {p1.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </Link>

                    {/* Product 2 - Standard cell */}
                    <Link
                      href={`/products/${p2.slug}`}
                      className="col-span-1 row-span-1 group relative overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={p2.thumbnail}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p2.name}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-serif font-bold">{p2.name}</h3>
                        <p className="text-lg font-bold">₹{p2.price}</p>
                      </div>
                      {p2.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </Link>

                    {/* Product 3 - Standard cell */}
                    <Link
                      href={`/products/${p3.slug}`}
                      className="col-span-1 row-span-1 group relative overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={p3.thumbnail}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p3.name}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-serif font-bold">{p3.name}</h3>
                        <p className="text-lg font-bold">₹{p3.price}</p>
                      </div>
                      {p3.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </Link>

                    {/* Product 4 - Tall (1x2) */}
                    <Link
                      href={`/products/${p4.slug}`}
                      className="col-span-1 row-span-1 sm:row-span-2 group relative overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={p4.thumbnail}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p4.name}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-6 left-4 text-white">
                        <h3 className="text-2xl font-serif font-bold mb-2">{p4.name}</h3>
                        <p className="text-lg font-bold">₹{p4.price}</p>
                      </div>
                      {p4.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </Link>

                    {/* Product 5 - Wide (2x1) */}
                    <Link
                      href={`/products/${p5.slug}`}
                      className="col-span-2 row-span-1 group relative overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={p5.thumbnail}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p5.name}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-serif font-bold">{p5.name}</h3>
                        <p className="text-lg font-bold">₹{p5.price}</p>
                      </div>
                      {p5.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </Link>

                    {/* Product 6 */}
                    <Link
                      href={`/products/${p6.slug}`}
                      className="col-span-1 row-span-1 group relative overflow-hidden rounded-3xl"
                    >
                      <Image
                        src={p6.thumbnail}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p6.name}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-serif font-bold">{p6.name}</h3>
                        <p className="text-lg font-bold">₹{p6.price}</p>
                      </div>
                      {p6.isFeatured && (
                        <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </Link>
                  </div>
                </div>
              )
            })()}

            {/* All Products Grid (Standard 4-column layout) */}
            {filteredProducts.length > 0 && (
              <>
                <h2 className="text-3xl font-serif font-bold text-[hsl(var(--sienna))] mb-8">
                  {filteredProducts.length >= 6 ? 'All Products' : 'Our Products'}
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.slice(filteredProducts.length >= 6 ? 6 : 0).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group"
                    >
                      <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={product.thumbnail}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={product.name}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                        {product.isFeatured && (
                          <div className="absolute top-4 right-4 bg-[hsl(var(--saffron))] text-white px-3 py-1 rounded-full text-xs font-bold">
                            Featured
                          </div>
                        )}
                        {product.comparePrice && (
                          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Save ₹{product.comparePrice - product.price}
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[hsl(var(--sienna))] mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.shortDesc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[hsl(var(--sienna))]">
                          ₹{product.price}
                        </span>
                        <button className="bg-[hsl(var(--saffron))] text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all hover:scale-105">
                          View
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Results Info & Pagination */}
                <ResultsInfo
                  currentPage={currentPage}
                  perPage={perPage}
                  totalCount={totalCount}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/products"
                  searchParams={{
                    ...(category && { category }),
                    ...(search && { search }),
                    ...(featured && { featured }),
                    ...(festival && { festival }),
                    ...(bakeryType && { bakeryType }),
                  }}
                />
              </>
            )}
          </Suspense>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 font-serif text-2xl font-bold text-gray-700">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or browse all products
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-full bg-[hsl(var(--sienna))] px-8 py-3 font-bold text-[hsl(var(--cream))] transition-all hover:bg-[hsl(var(--saffron))]"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function ProductGridSkeleton() {
  return (
    <div>
      {/* Featured Products Bento Skeleton */}
      <div className="mb-16">
        <div className="h-10 w-64 animate-pulse rounded bg-gray-200 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[250px]">
          {/* Large featured */}
          <div className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 bg-gray-200 rounded-3xl animate-pulse" />
          {/* Two standard */}
          <div className="col-span-1 row-span-1 bg-gray-200 rounded-3xl animate-pulse" />
          <div className="col-span-1 row-span-1 bg-gray-200 rounded-3xl animate-pulse" />
          {/* Tall */}
          <div className="col-span-1 row-span-1 sm:row-span-2 bg-gray-200 rounded-3xl animate-pulse" />
          {/* Wide */}
          <div className="col-span-2 row-span-1 bg-gray-200 rounded-3xl animate-pulse" />
          {/* Standard */}
          <div className="col-span-1 row-span-1 bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      </div>

      {/* Standard Grid Skeleton */}
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-8" />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden">
            <div className="h-80 animate-pulse bg-gray-200 rounded-2xl mb-4" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 mb-2" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 mb-3" />
            <div className="flex items-center justify-between">
              <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
