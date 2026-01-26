import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Users, Leaf, Award } from 'lucide-react'

const IMAGES = {
  heroAbout: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80',
  artisan1: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
  artisan2: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80',
  team: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80',
}

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Crafted with Love',
      description: 'Every product is handmade by skilled artisans who pour their heart into their craft',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community First',
      description: 'Supporting local bakers and artisans across India, creating sustainable livelihoods',
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustainable Practices',
      description: 'Eco-friendly packaging and sourcing ingredients from responsible suppliers',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality Guaranteed',
      description: 'Premium ingredients, traditional techniques, and rigorous quality standards',
    },
  ]

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started with 3 partner bakeries in Delhi' },
    { year: '2021', title: 'Expansion', description: 'Grew to 15 cities across India' },
    { year: '2022', title: '10K Customers', description: 'Served our 10,000th happy customer' },
    { year: '2023', title: 'Festival Line', description: 'Launched curated festival hampers' },
    { year: '2024', title: 'Going Green', description: '100% sustainable packaging initiative' },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={IMAGES.heroAbout}
              fill
              className="object-cover brightness-75"
              alt="Artisan bakers at work"
              priority
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 container mx-auto h-full flex items-center px-4">
            <div className="max-w-3xl text-white">
              <h1 className="font-serif text-6xl lg:text-7xl font-black mb-6 leading-none drop-shadow-2xl">
                Our Story
              </h1>
              <p className="text-2xl mb-4 leading-relaxed drop-shadow-md">
                Every product tells a story of tradition, craftsmanship, and love
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto max-w-4xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-serif font-bold text-[hsl(var(--sienna))] mb-6">
                  Where It All Began
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  Homespun was born from a simple belief: the best gifts come from the heart
                  and hands of skilled artisans. We partner with India&apos;s finest bakers and
                  craftspeople who pour their expertise into every loaf, cake, and festive creation.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  From sunrise sourdough to midnight birthday cakes, from Diwali diyas to
                  handcrafted celebration hampers, we celebrate the artisan spirit that makes
                  every occasion truly special.
                </p>
              </div>
              <div className="relative h-96 rounded-3xl overflow-hidden">
                <Image
                  src={IMAGES.artisan1}
                  fill
                  className="object-cover"
                  alt="Artisan baking process"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-3xl overflow-hidden order-last lg:order-first">
                <Image
                  src={IMAGES.artisan2}
                  fill
                  className="object-cover"
                  alt="Fresh baked goods"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-4xl font-serif font-bold text-[hsl(var(--sienna))] mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  To bring authentic, handcrafted quality to every doorstep across India.
                  We believe in preserving traditional baking techniques while embracing
                  modern convenience through same-day and midnight delivery.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Every order supports local artisans, sustainable practices, and the time-honored
                  craft of artisan baking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] px-4 py-16">
          <div className="container mx-auto">
            <h2 className="text-5xl font-serif font-bold text-[hsl(var(--sienna))] text-center mb-4">
              Our Values
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12">
              What drives us every day
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-[hsl(var(--saffron))] rounded-2xl flex items-center justify-center text-white mb-6">
                    {value.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[hsl(var(--sienna))] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-5xl font-serif font-bold text-[hsl(var(--sienna))] text-center mb-16">
              Our Journey
            </h2>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex gap-8 items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--sienna))] to-[hsl(var(--saffron))] flex items-center justify-center">
                      <span className="font-serif text-2xl font-bold text-white">
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <h3 className="text-2xl font-serif font-bold text-[hsl(var(--sienna))] mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-[hsl(var(--sienna))] text-white px-4 py-20">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-5xl font-serif font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl mb-10 text-[hsl(var(--cream))]">
              Experience the magic of artisan baking delivered to your doorstep
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/products?category=bakery"
                className="rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-2xl transition-transform hover:scale-105"
              >
                Explore Bakery
              </Link>
              <Link
                href="/products?category=festivals"
                className="rounded-full bg-white text-[hsl(var(--sienna))] px-8 py-4 font-bold shadow-2xl transition-transform hover:scale-105"
              >
                Browse Festival Gifts
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
