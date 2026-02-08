import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Star, Heart, Instagram } from 'lucide-react'

// Placeholder images from Unsplash
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80',
  cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
  breads: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  cookies: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
  pastries: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
  cupcakes: 'https://images.unsplash.com/photo-1426869884541-df7117556757?w=800&q=80',
  donuts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
  diwali: 'https://images.unsplash.com/photo-1605811345115-f4c2d8dea51a?w=1200&q=80',
  baker: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80',
  festivalBanner: 'https://images.unsplash.com/photo-1610832745114-e0e01453ff7b?w=1920&q=80',
}

export default function HomePage() {
  // Bestseller products data
  const bestsellers = [
    {
      id: 1,
      name: 'Classic Chocolate Cake',
      description: 'Rich chocolate layers with ganache',
      price: 899,
      image: IMAGES.cakes,
    },
    {
      id: 2,
      name: 'Artisan Sourdough',
      description: 'Traditional 24-hour fermentation',
      price: 299,
      image: IMAGES.breads,
    },
    {
      id: 3,
      name: 'Gourmet Cookie Box',
      description: 'Assorted premium cookies',
      price: 499,
      image: IMAGES.cookies,
    },
    {
      id: 4,
      name: 'French Croissants',
      description: 'Buttery, flaky perfection',
      price: 349,
      image: IMAGES.pastries,
    },
    {
      id: 5,
      name: 'Cupcake Collection',
      description: '6-pack assorted flavors',
      price: 599,
      image: IMAGES.cupcakes,
    },
    {
      id: 6,
      name: 'Glazed Donuts',
      description: 'Fresh & fluffy, 4-pack',
      price: 249,
      image: IMAGES.donuts,
    },
  ]

  // Promise features data
  const promises = [
    {
      icon: '✨',
      title: 'Artisan Quality',
      description: 'Handcrafted by skilled bakers using premium ingredients',
    },
    {
      icon: '🌅',
      title: 'Baked Fresh Daily',
      description: 'Made fresh every morning, never compromising quality',
    },
    {
      icon: '🚀',
      title: 'Same-Day & Midnight',
      description: 'Order by 2 PM for same-day or midnight delivery',
    },
    {
      icon: '🎨',
      title: 'Custom Creations',
      description: 'Personalize with photos, messages, custom designs',
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      text: 'The sourdough is incredible! Finally found a bakery in India that does authentic artisan bread.',
      author: 'Meera Kapoor',
      location: 'Delhi',
    },
    {
      text: 'We ordered Diwali hampers for our team. The quality and presentation were outstanding!',
      author: 'Rahul Sharma',
      location: 'Bangalore',
    },
    {
      text: 'The custom cake was a masterpiece! Homespun truly understands artisan baking.',
      author: 'Anjali Verma',
      location: 'Mumbai',
    },
  ]

  // Instagram posts (placeholder)
  const instagramPosts = [
    { id: '1', image: IMAGES.cakes },
    { id: '2', image: IMAGES.breads },
    { id: '3', image: IMAGES.cookies },
    { id: '4', image: IMAGES.pastries },
    { id: '5', image: IMAGES.cupcakes },
    { id: '6', image: IMAGES.donuts },
    { id: '7', image: IMAGES.cakes },
    { id: '8', image: IMAGES.cookies },
    { id: '9', image: IMAGES.pastries },
    { id: '10', image: IMAGES.cupcakes },
    { id: '11', image: IMAGES.breads },
    { id: '12', image: IMAGES.donuts },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section - Full-Screen with Background Image */}
        <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
          {/* Full-bleed background image */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.hero}
              fill
              className="object-cover brightness-75"
              alt="Artisan bakery with fresh baked goods"
              priority
              sizes="100vw"
            />
          </div>

          {/* Content overlay - left aligned */}
          <div className="relative z-10 container mx-auto h-full flex items-center px-4">
            <div className="max-w-2xl text-white">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 leading-none drop-shadow-2xl">
                Handcrafted
                <br />
                with Heart
              </h1>
              <p className="text-lg sm:text-xl lg:text-3xl mb-6 sm:mb-8 font-serif italic text-[hsl(var(--cream))] drop-shadow-lg">
                Where Traditions Rise
              </p>
              <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed drop-shadow-md">
                Discover artisan-baked delights and festive treasures crafted
                with love. From celebration cakes to Diwali hampers, Homespun
                brings authentic handcrafted quality to every occasion with
                same-day and midnight delivery across India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products?category=bakery"
                  className="rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-2xl transition-transform hover:scale-105 active:scale-95"
                >
                  Explore Bakery
                </Link>
                <Link
                  href="/products?category=hampers"
                  className="rounded-full bg-white/20 backdrop-blur-sm border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-[hsl(var(--sienna))]"
                >
                  Gift Hampers
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </section>

        {/* Featured Products - Bento Grid */}
        <section className="bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] px-4 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[hsl(var(--sienna))] mb-3">
              Artisan Collections
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-10">
              Handcrafted with love, delivered with care
            </p>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] md:auto-rows-[250px]">
              {/* Large featured item - spans 2 columns, 2 rows */}
              <Link
                href="/products?category=bakery&bakeryType=cakes"
                className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 group relative overflow-hidden rounded-3xl"
              >
                <Image
                  src={IMAGES.cakes}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Celebration Cakes"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                  <h3 className="text-3xl font-serif font-bold mb-2">
                    Celebration Cakes
                  </h3>
                  <p className="text-lg">Custom designs for every occasion</p>
                </div>
              </Link>

              {/* Artisan Breads */}
              <Link
                href="/products?category=breads"
                className="col-span-1 row-span-1 group relative overflow-hidden rounded-3xl"
              >
                <Image
                  src={IMAGES.breads}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Artisan Breads"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-serif font-bold">Artisan Breads</h3>
                </div>
              </Link>

              {/* Gourmet Cookies */}
              <Link
                href="/products?category=cookies"
                className="col-span-1 row-span-1 group relative overflow-hidden rounded-3xl"
              >
                <Image
                  src={IMAGES.cookies}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Gourmet Cookies"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-serif font-bold">Gourmet Cookies</h3>
                </div>
              </Link>

              {/* French Pastries - tall item */}
              <Link
                href="/products?category=pastries"
                className="col-span-1 row-span-1 sm:row-span-2 group relative overflow-hidden rounded-3xl"
              >
                <Image
                  src={IMAGES.pastries}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="French Pastries"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-4 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">
                    French Pastries
                  </h3>
                  <p className="text-sm">Buttery croissants & more</p>
                </div>
              </Link>

              {/* Gift Hampers - wide item */}
              <Link
                href="/products?category=hampers"
                className="col-span-1 sm:col-span-2 row-span-1 group relative overflow-hidden rounded-3xl"
              >
                <Image
                  src={IMAGES.diwali}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Gift Hampers"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-serif font-bold">Gift Hampers</h3>
                </div>
              </Link>

              {/* Cupcakes */}
              <Link
                href="/products?category=bakery&bakeryType=cakes"
                className="col-span-1 row-span-1 group relative overflow-hidden rounded-3xl"
              >
                <Image
                  src={IMAGES.cupcakes}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Cupcakes"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-serif font-bold">Cupcakes</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers Carousel */}
        <section className="bg-white px-4 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto">
            <div className="flex items-end justify-between mb-6 sm:mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[hsl(var(--sienna))] mb-2">
                  Bestsellers
                </h2>
                <p className="text-xl text-gray-600">
                  What our customers love most
                </p>
              </div>
              <Link
                href="/products"
                className="text-[hsl(var(--saffron))] font-bold hover:underline hidden md:block"
              >
                View All →
              </Link>
            </div>

            {/* Horizontal scroll carousel */}
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {bestsellers.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-72 md:w-80 lg:w-96 snap-start group"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={product.image}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={product.name}
                      sizes="320px"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[hsl(var(--sienna))] mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[hsl(var(--sienna))]">
                      ₹{product.price}
                    </span>
                    <button className="bg-[hsl(var(--saffron))] text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile "View All" link */}
            <div className="text-center mt-6 md:hidden">
              <Link
                href="/products"
                className="text-[hsl(var(--saffron))] font-bold hover:underline"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-gradient-to-br from-[hsl(var(--cream))] to-white px-4 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Image */}
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&q=80"
                  fill
                  className="object-cover"
                  alt="Homespun bakery story"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Right: Text */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[hsl(var(--sienna))] mb-4">
                  Our Story
                </h2>
                <p className="text-xl italic text-gray-600 mb-6">
                  Every product tells a story of tradition, craftsmanship, and love
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Homespun was born from a simple belief: the best gifts come from the
                  heart and hands of skilled artisans. We partner with India&apos;s finest
                  bakers and craftspeople who pour their expertise into every loaf,
                  cake, and festive creation.
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  From sunrise sourdough to midnight birthday cakes, from Diwali diyas
                  to handcrafted celebration hampers, we celebrate the artisan spirit
                  that makes every occasion truly special.
                </p>
                <Link
                  href="/about"
                  className="inline-block bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all hover:scale-105"
                >
                  Read Our Full Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Homespun Promise - Dark Section */}
        <section className="relative bg-[hsl(var(--sienna))] text-white px-4 py-20 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--saffron))] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--cream))] rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Large image */}
              <div className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden">
                <Image
                  src={IMAGES.baker}
                  fill
                  className="object-cover"
                  alt="Artisan baker at work"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Right: Promise grid */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">
                  The Homespun Promise
                </h2>
                <p className="text-xl mb-12 text-[hsl(var(--cream))]">
                  Quality, authenticity, and care in every delivery
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promises.map((item) => (
                    <div key={item.title} className="space-y-3">
                      <div className="w-16 h-16 bg-[hsl(var(--saffron))] rounded-2xl flex items-center justify-center text-3xl">
                        {item.icon}
                      </div>
                      <h3 className="font-serif text-xl font-bold">
                        {item.title}
                      </h3>
                      <p className="text-[hsl(var(--cream))] text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gift Hampers Banner - Enhanced */}
        <section className="relative h-96 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.festivalBanner}
              fill
              className="object-cover"
              alt="Beautiful gift hampers and celebrations"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--deep-red))]/90 to-[hsl(var(--saffron))]/80" />
          </div>

          <div className="container mx-auto relative z-10 h-full flex items-center justify-center text-center text-white px-4">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black mb-6 drop-shadow-lg">
                Thoughtfully Curated Gift Sets
              </h2>
              <p className="text-2xl mb-8 leading-relaxed drop-shadow-md">
                Celebrate life&apos;s special moments with our curated gift hampers.
                Perfect for any occasion.
              </p>
              <Link
                href="/products?category=hampers"
                className="inline-block bg-white text-[hsl(var(--saffron))] px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl active:scale-95"
              >
                Browse Gift Hampers
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials - Enhanced */}
        <section className="bg-white px-4 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[hsl(var(--sienna))] text-center mb-3">
              Stories from Our Community
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12">
              Join 10,000+ happy customers across India
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] p-8 shadow-lg hover:shadow-2xl transition-shadow"
                >
                  {/* Star rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[hsl(var(--saffron))] text-[hsl(var(--saffron))]"
                      />
                    ))}
                  </div>

                  <p className="italic text-gray-700 mb-6 leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <p className="font-bold text-[hsl(var(--sienna))]">
                    — {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Feed Section */}
        <section className="bg-gradient-to-br from-[hsl(var(--warm-beige))] to-[hsl(var(--cream))] px-4 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[hsl(var(--sienna))] mb-3">
                @homespun_bakery_gifts
              </h2>
              <p className="text-xl text-gray-600">
                Follow us for daily baking inspiration
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {instagramPosts.map((post, index) => (
                <a
                  key={index}
                  href={`https://instagram.com/homespun_bakery_gifts`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                >
                  <Image
                    src={post.image}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={`Instagram post ${index + 1}`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="https://instagram.com/homespun_bakery_gifts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-shadow"
              >
                <Instagram className="w-6 h-6" />
                Follow @homespun_bakery_gifts
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
