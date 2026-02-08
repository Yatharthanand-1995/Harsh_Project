import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[hsl(var(--sienna))] to-[#704010] text-[hsl(var(--cream))]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-serif text-3xl font-black">Homespun</h3>
            <p className="leading-relaxed text-[hsl(var(--cream))]/90">
              Handcrafted with heart, gifted with joy. Celebrating India&apos;s
              artisan traditions through premium bakery and festive gifts.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-4 font-serif text-xl font-bold text-[hsl(var(--saffron))]">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=bakery"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Artisan Bakery
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=festivals"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Festival Gifts
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/corporate"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Corporate Gifting
                </Link>
              </li> */}
              <li>
                <Link
                  href="/products?featured=true"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-4 font-serif text-xl font-bold text-[hsl(var(--saffron))]">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/delivery"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:pl-1 hover:text-[hsl(var(--saffron))]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/20 pt-8 text-center">
          <p className="text-white/70">
            &copy; {new Date().getFullYear()} Homespun. All rights reserved. | GST Registered
          </p>
          <p className="mt-2 text-white/70">
            Handcrafted with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}
