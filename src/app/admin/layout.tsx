import Link from 'next/link'

export const metadata = {
  title: 'Admin — Homespun',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[hsl(var(--sienna))] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-4">
          <span className="font-serif text-xl font-bold">Homespun Admin</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/orders" className="opacity-90 hover:opacity-100 hover:underline">
              Payment Verification
            </Link>
          </nav>
        </div>
        <Link href="/" className="text-sm opacity-75 hover:opacity-100 hover:underline">
          ← Back to site
        </Link>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
