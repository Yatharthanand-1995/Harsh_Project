import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--saffron))]/10 px-4 py-20">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="mb-4 font-serif text-6xl font-black text-[hsl(var(--sienna))]">
              About Homespun
            </h1>
            <p className="font-serif text-2xl italic text-[hsl(var(--deep-red))]">
              Handcrafted with Heart, Delivered with Love
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-white px-4 py-20">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="mb-4 font-serif text-5xl font-bold text-[hsl(var(--sienna))]">
              Our Story
            </h2>
            <p className="mb-8 text-xl italic text-gray-600">
              Every product tells a story of tradition, craftsmanship, and love
            </p>
            <div className="rounded-3xl bg-white p-12 shadow-2xl border-2 border-gray-100">
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

        {/* Stories from Our Community (Testimonials) */}
        <section className="bg-white px-4 py-20">
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
