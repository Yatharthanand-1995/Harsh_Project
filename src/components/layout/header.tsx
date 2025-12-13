'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-[hsl(var(--sienna))] to-[#A0522D] shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-3xl font-black tracking-wider text-[hsl(var(--cream))] drop-shadow-md transition-transform hover:scale-105"
        >
          Homespun
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link
              href="/"
              className="relative text-base font-semibold text-[hsl(var(--cream))] transition-colors after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-[hsl(var(--saffron))] after:transition-all hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/products?category=bakery"
              className="relative text-base font-semibold text-[hsl(var(--cream))] transition-colors after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-[hsl(var(--saffron))] after:transition-all hover:after:w-full"
            >
              Bakery
            </Link>
          </li>
          <li>
            <Link
              href="/products?category=festivals"
              className="relative text-base font-semibold text-[hsl(var(--cream))] transition-colors after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-[hsl(var(--saffron))] after:transition-all hover:after:w-full"
            >
              Festivals
            </Link>
          </li>
          <li>
            <Link
              href="/corporate"
              className="relative text-base font-semibold text-[hsl(var(--cream))] transition-colors after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-[hsl(var(--saffron))] after:transition-all hover:after:w-full"
            >
              Corporate
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="relative text-base font-semibold text-[hsl(var(--cream))] transition-colors after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-[hsl(var(--saffron))] after:transition-all hover:after:w-full"
            >
              About
            </Link>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-[hsl(var(--cream))] transition-colors hover:text-[hsl(var(--saffron))]"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--saffron))] text-xs font-bold text-white">
              0
            </span>
          </Link>

          <Link
            href="/account"
            className="text-[hsl(var(--cream))] transition-colors hover:text-[hsl(var(--saffron))]"
            aria-label="User Account"
          >
            <User className="h-6 w-6" />
          </Link>

          <Link
            href="/products"
            className="hidden rounded-full bg-[hsl(var(--saffron))] px-6 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl md:block"
          >
            Shop Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[hsl(var(--cream))]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/20 bg-[hsl(var(--sienna))] md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link
                href="/"
                className="block py-2 text-base font-semibold text-[hsl(var(--cream))]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=bakery"
                className="block py-2 text-base font-semibold text-[hsl(var(--cream))]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bakery
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=festivals"
                className="block py-2 text-base font-semibold text-[hsl(var(--cream))]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Festivals
              </Link>
            </li>
            <li>
              <Link
                href="/corporate"
                className="block py-2 text-base font-semibold text-[hsl(var(--cream))]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Corporate
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-2 text-base font-semibold text-[hsl(var(--cream))]"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="mt-2 block rounded-full bg-[hsl(var(--saffron))] px-6 py-2.5 text-center text-base font-bold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
