import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--cream))] via-[hsl(var(--warm-beige))] to-[#FAEBD7] px-4 py-24">
          {/* Animated Background Element */}
          <div className="pointer-events-none absolute -right-10 -top-32 h-[600px] w-[600px] animate-pulse rounded-full bg-[hsl(var(--saffron))]/20 blur-3xl" />

          <div className="container mx-auto">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Hero Text */}
              <div className="space-y-6">
                <h1 className="font-serif text-5xl font-black leading-tight text-[hsl(var(--sienna))] lg:text-6xl">
                  Handcrafted
                  <br />
                  with Heart
                </h1>
                <p className="font-serif text-2xl italic text-[hsl(var(--deep-red))]">
                  Where Traditions Rise
                </p>
                <p className="text-lg leading-relaxed text-gray-600">
                  Discover artisan-baked delights and festive treasures crafted
                  with love. From celebration cakes to Diwali hampers, Homespun
                  brings authentic handcrafted quality to every occasion with
                  same-day and midnight delivery across India.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/products?category=bakery"
                    className="rounded-full bg-[hsl(var(--sienna))] px-8 py-4 font-bold text-[hsl(var(--cream))] shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                  >
                    Explore Bakery
                  </Link>
                  <Link
                    href="/products?category=festivals"
                    className="rounded-full border-3 border-[hsl(var(--sienna))] bg-transparent px-8 py-4 font-bold text-[hsl(var(--sienna))] transition-all hover:bg-[hsl(var(--sienna))] hover:text-[hsl(var(--cream))]"
                  >
                    Festival Gifts
                  </Link>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🥖', title: 'Artisan Breads', subtitle: 'Freshly Baked Daily' },
                  { icon: '🎂', title: 'Celebration Cakes', subtitle: 'Custom Designs' },
                  { icon: '🪔', title: 'Festive Hampers', subtitle: 'Traditional & Modern' },
                  { icon: '🍪', title: 'Gourmet Cookies', subtitle: 'Gift Boxes' },
                ].map((product) => (
                  <div
                    key={product.title}
                    className="group rounded-3xl border-2 border-transparent bg-white p-6 text-center shadow-lg transition-all hover:-translate-y-2 hover:rotate-2 hover:border-[hsl(var(--saffron))] hover:shadow-2xl"
                  >
                    <div className="mb-3 text-5xl drop-shadow-md">{product.icon}</div>
                    <h3 className="mb-2 font-serif text-lg font-bold text-[hsl(var(--sienna))]">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600">{product.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="mb-4 font-serif text-5xl font-bold text-[hsl(var(--sienna))]">
              Our Story
            </h2>
            <p className="mb-8 text-xl italic text-gray-600">
              Every product tells a story of tradition, craftsmanship, and love
            </p>
            <div className="rounded-3xl bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] p-12 shadow-xl">
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Homespun was born from a simple belief: the best gifts come from
                the heart and hands of skilled artisans. We partner with India&apos;s
                finest bakers and craftspeople who pour their expertise into every
                loaf, cake, and festive creation.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                From sunrise sourdough to midnight birthday cakes, from Diwali
                diyas to handcrafted celebration hampers, we celebrate the artisan
                spirit that makes every occasion truly special.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-gradient-to-br from-[hsl(var(--cream))] to-[#FAEBD7] px-4 py-20">
          <div className="container mx-auto">
            <h2 className="mb-4 text-center font-serif text-5xl font-bold text-[hsl(var(--sienna))]">
              Artisan Collections
            </h2>
            <p className="mb-12 text-center text-xl text-gray-600">
              Handcrafted with love, delivered with care
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '🎂',
                  title: 'Celebration Cakes',
                  description:
                    'Custom-designed cakes for birthdays, anniversaries, and every milestone worth celebrating',
                },
                {
                  icon: '🥐',
                  title: 'Artisan Breads & Pastries',
                  description:
                    'Sourdough, croissants, and European-style baked goods made fresh daily',
                },
                {
                  icon: '🪔',
                  title: 'Diwali Hampers',
                  description:
                    'Curated gift boxes with sweets, diyas, and festive decorative items',
                },
                {
                  icon: '🍪',
                  title: 'Gourmet Cookie Boxes',
                  description:
                    'Premium assortments perfect for gifting or personal indulgence',
                },
                {
                  icon: '🎊',
                  title: 'Holi Celebration Kits',
                  description:
                    'Colors, snacks, and festive treats for vibrant celebrations',
                },
                {
                  icon: '🎁',
                  title: 'Corporate Gift Boxes',
                  description:
                    'Professional gifting solutions with custom branding options',
                },
              ].map((category) => (
                <Link
                  key={category.title}
                  href="/products"
                  className="group overflow-hidden rounded-3xl border-3 border-transparent bg-white shadow-lg transition-all hover:-translate-y-2 hover:border-[hsl(var(--saffron))] hover:shadow-2xl"
                >
                  <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[hsl(var(--sienna))] to-[hsl(var(--saffron))] text-8xl">
                    {category.icon}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="mb-2 font-serif text-xl font-bold text-[hsl(var(--sienna))]">
                      {category.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto">
            <h2 className="mb-4 text-center font-serif text-5xl font-bold text-[hsl(var(--sienna))]">
              The Homespun Promise
            </h2>
            <p className="mb-12 text-center text-xl text-gray-600">
              Quality, authenticity, and care in every delivery
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '✨',
                  title: 'Artisan Quality',
                  description:
                    'Every product handcrafted by skilled bakers using premium ingredients and traditional techniques.',
                },
                {
                  icon: '🌅',
                  title: 'Baked Fresh Daily',
                  description:
                    'Breads and pastries made fresh every morning. We never compromise on quality.',
                },
                {
                  icon: '🚀',
                  title: 'Same-Day & Midnight',
                  description:
                    'Order by 2 PM for same-day delivery. Surprise loved ones with midnight deliveries.',
                },
                {
                  icon: '🎨',
                  title: 'Custom Creations',
                  description:
                    'Personalize cakes with photos, messages, and custom designs.',
                },
                {
                  icon: '🌿',
                  title: 'Eco-Friendly',
                  description:
                    'Sustainable packaging that looks premium while caring for our planet.',
                },
                {
                  icon: '❄️',
                  title: 'Cold Chain Delivery',
                  description:
                    'Temperature-controlled logistics ensure freshness from bakery to doorstep.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl bg-gradient-to-br from-[hsl(var(--cream))] to-white p-8 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--sienna))] to-[#A0522D] text-4xl shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-bold text-[hsl(var(--sienna))]">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--deep-red))] to-[#8B0000] px-4 py-20 text-center text-white">
          <div className="pointer-events-none absolute left-[10%] top-0 animate-pulse text-[15rem] opacity-10">
            🪔
          </div>
          <div className="pointer-events-none absolute bottom-0 right-[15%] animate-pulse text-[12rem] opacity-10">
            🎊
          </div>

          <div className="container relative z-10 mx-auto max-w-4xl">
            <h2 className="mb-6 font-serif text-5xl font-black text-[hsl(var(--saffron))]">
              Festival Season is Here!
            </h2>
            <p className="mb-8 text-xl leading-relaxed">
              Celebrate India&apos;s rich traditions with our curated festive
              collections. From Diwali hampers to Holi celebration kits, make
              every festival memorable.
            </p>
            <Link
              href="/products?category=festivals"
              className="inline-block rounded-full bg-[hsl(var(--saffron))] px-10 py-4 font-bold text-white shadow-2xl transition-all hover:-translate-y-1"
            >
              Browse Festival Gifts
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[hsl(var(--cream))] px-4 py-20">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center font-serif text-5xl font-bold text-[hsl(var(--sienna))]">
              Stories from Our Community
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  text: 'The sourdough is incredible! Finally found a bakery in India that does authentic artisan bread.',
                  author: 'Meera Kapoor, Delhi',
                },
                {
                  text: 'We ordered Diwali hampers for our team. The quality and presentation were outstanding!',
                  author: 'Rahul Sharma, HR Manager',
                },
                {
                  text: 'The custom cake was a masterpiece! Homespun truly understands artisan baking.',
                  author: 'Anjali Verma, Mumbai',
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl border-l-4 border-[hsl(var(--saffron))] bg-white p-8 shadow-lg"
                >
                  <div className="absolute left-5 top-2 font-serif text-6xl text-[hsl(var(--saffron))]/20">
                    &quot;
                  </div>
                  <p className="relative z-10 mb-6 italic leading-relaxed text-gray-600">
                    {testimonial.text}
                  </p>
                  <p className="font-bold text-[hsl(var(--sienna))]">
                    — {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
