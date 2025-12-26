import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import {
  PRODUCTS,
  getAvailableFestivals,
  FESTIVAL_NAMES,
  FestivalType,
  getAvailableBakeryTypes,
  BAKERY_TYPE_NAMES,
  BakeryType,
} from '@/data/products'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    featured?: string
    festival?: string
    bakeryType?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { category, search, featured, festival, bakeryType } = params

  // Filter products based on search params
  let filteredProducts = PRODUCTS

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category)
  }

  if (festival) {
    filteredProducts = filteredProducts.filter((p) => p.festivalType === festival)
  }

  if (bakeryType) {
    filteredProducts = filteredProducts.filter((p) => p.bakeryType === bakeryType)
  }

  if (featured === 'true') {
    filteredProducts = filteredProducts.filter((p) => p.isFeatured)
  }

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Get available festivals and bakery types for the filters
  const availableFestivals = getAvailableFestivals()
  const availableBakeryTypes = getAvailableBakeryTypes()

  const categoryTitle = {
    bakery: 'Artisan Bakery',
    festivals: 'Festival Gifts',
    corporate: 'Corporate Gifting',
    cakes: 'Celebration Cakes',
    frozen: 'Frozen & Ready to Consume',
  }

  // Determine page title
  let pageTitle = 'All Products'
  if (bakeryType) {
    pageTitle = `${BAKERY_TYPE_NAMES[bakeryType as BakeryType]}`
  } else if (festival) {
    pageTitle = `${FESTIVAL_NAMES[festival as FestivalType]} Gifts`
  } else if (category) {
    pageTitle = categoryTitle[category as keyof typeof categoryTitle]
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-serif text-5xl font-bold text-[hsl(var(--sienna))]">
              {pageTitle}
            </h1>
            <p className="text-lg text-gray-600">
              Handcrafted with love, delivered with care
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/products"
                className={`rounded-full px-6 py-2 font-semibold transition-colors ${
                  !category
                    ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All ({PRODUCTS.length})
              </Link>
              <Link
                href="/products?category=bakery"
                className={`rounded-full px-6 py-2 font-semibold transition-colors ${
                  category === 'bakery'
                    ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Bakery ({PRODUCTS.filter(p => p.category === 'bakery').length})
              </Link>
              <Link
                href="/products?category=cakes"
                className={`rounded-full px-6 py-2 font-semibold transition-colors ${
                  category === 'cakes'
                    ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cakes ({PRODUCTS.filter(p => p.category === 'cakes').length})
              </Link>
              <Link
                href="/products?category=festivals"
                className={`rounded-full px-6 py-2 font-semibold transition-colors ${
                  category === 'festivals'
                    ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Festivals ({PRODUCTS.filter(p => p.category === 'festivals').length})
              </Link>
              <Link
                href="/products?category=frozen"
                className={`rounded-full px-6 py-2 font-semibold transition-colors ${
                  category === 'frozen'
                    ? 'bg-[hsl(var(--sienna))] text-[hsl(var(--cream))]'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Frozen ({PRODUCTS.filter(p => p.category === 'frozen').length})
              </Link>
            </div>

            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}
            </p>
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
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    category === 'bakery' && !bakeryType
                      ? 'bg-[hsl(var(--saffron))] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Bakery
                </Link>
                {availableBakeryTypes.map((type) => {
                  const typeProductCount = PRODUCTS.filter(
                    (p) => p.bakeryType === type
                  ).length
                  return (
                    <Link
                      key={type}
                      href={`/products?category=bakery&bakeryType=${type}`}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                        bakeryType === type
                          ? 'bg-[hsl(var(--saffron))] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {BAKERY_TYPE_NAMES[type]} ({typeProductCount})
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Festival Sub-Filters */}
          {(category === 'festivals' || festival) && availableFestivals.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                Browse by Festival
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products?category=festivals"
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    category === 'festivals' && !festival
                      ? 'bg-[hsl(var(--saffron))] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Festivals
                </Link>
                {availableFestivals.map((festivalType) => {
                  const festivalProductCount = PRODUCTS.filter(
                    (p) => p.festivalType === festivalType
                  ).length
                  return (
                    <Link
                      key={festivalType}
                      href={`/products?category=festivals&festival=${festivalType}`}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                        festival === festivalType
                          ? 'bg-[hsl(var(--saffron))] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {FESTIVAL_NAMES[festivalType]} ({festivalProductCount})
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    {product.isFeatured && (
                      <div className="absolute right-3 top-3 rounded-full bg-[hsl(var(--saffron))] px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Featured
                      </div>
                    )}
                    {product.comparePrice && (
                      <div className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Save ₹{product.comparePrice - product.price}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-[hsl(var(--cream))] px-3 py-1 text-xs font-semibold text-[hsl(var(--sienna))] capitalize">
                        {product.category}
                      </span>
                      {product.reviews && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="text-[hsl(var(--saffron))]">★</span>
                          <span>{product.reviews.average}</span>
                          <span>({product.reviews.count})</span>
                        </div>
                      )}
                    </div>

                    <h3 className="mb-2 font-serif text-xl font-bold text-[hsl(var(--sienna))] group-hover:text-[hsl(var(--saffron))] line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">{product.shortDesc}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                        ₹{product.price}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.comparePrice}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock < 10 && (
                      <p className="mt-2 text-xs font-semibold text-orange-600">
                        Only {product.stock} left!
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    <button className="mt-4 w-full rounded-full bg-[hsl(var(--saffron))] py-3 font-bold text-white transition-all hover:bg-[hsl(var(--sienna))]">
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="h-64 animate-pulse bg-gray-200" />
          <div className="p-6">
            <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
