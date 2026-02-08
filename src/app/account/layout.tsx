'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, MapPin, Settings } from 'lucide-react'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/account', label: 'Profile', icon: User },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="mb-2 font-serif text-4xl font-bold text-[hsl(var(--sienna))]">
              My Account
            </h1>
            <p className="text-gray-600">
              Manage your profile, orders, and addresses
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-2 rounded-2xl bg-white p-4 shadow-lg">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all ${
                        isActive
                          ? 'bg-[hsl(var(--sienna))] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
