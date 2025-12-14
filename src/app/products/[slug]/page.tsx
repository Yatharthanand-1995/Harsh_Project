import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductActions } from '@/components/product/product-actions'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/data/products'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const categoryDisplay = {
    bakery: 'Artisan Bakery',
    festivals: 'Festival Gifts',
    corporate: 'Corporate Gifting',
    cakes: 'Celebration Cakes',
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[hsl(var(--sienna))]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/products"
              className="text-gray-500 hover:text-[hsl(var(--sienna))]"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-[hsl(var(--sienna))]">
              {product.name}
            </span>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] shadow-xl">
                <div className="relative aspect-square">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-2 inline-block rounded-full bg-[hsl(var(--saffron))]/20 px-4 py-1 text-sm font-semibold text-[hsl(var(--sienna))]">
                  {product.category}
                </div>
                <h1 className="mb-4 font-serif text-4xl font-bold text-[hsl(var(--sienna))]">
                  {product.name}
                </h1>
                <p className="text-lg leading-relaxed text-gray-600">
                  {product.shortDesc}
                </p>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(product.reviews.average)
                          ? 'text-[hsl(var(--saffron))]'
                          : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.reviews.average} ({product.reviews.count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-serif text-4xl font-bold text-[hsl(var(--sienna))]">
                    ₹{product.price}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.comparePrice}
                    </span>
                  )}
                  {product.comparePrice && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                      Save ₹{product.comparePrice - product.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    product.stock > 10 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className="text-sm font-semibold text-gray-700">
                  {product.stock > 10
                    ? 'In Stock'
                    : `Only ${product.stock} left in stock`}
                </span>
              </div>

              {/* Product Actions (Quantity Selector & Buttons) */}
              <ProductActions
                productId={product.id}
                productName={product.name}
                price={product.price}
                stock={product.stock}
              />

              {/* Delivery Info */}
              <div className="rounded-2xl bg-blue-50 p-6">
                <h3 className="mb-3 font-bold text-gray-800">Delivery Options</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Same-day delivery available (order before 2 PM)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Midnight delivery for special occasions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Free delivery on orders above ₹500</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                Product Details
              </h2>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-bold text-gray-800">Description</h3>
                  <p className="leading-relaxed text-gray-600">{product.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-bold text-gray-800">Ingredients</h3>
                    <p className="text-gray-600">{product.ingredients}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-bold text-gray-800">Allergens</h3>
                    <p className="text-gray-600">{product.allergens}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-bold text-gray-800">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[hsl(var(--cream))] px-4 py-1 text-sm font-semibold text-[hsl(var(--sienna))]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
