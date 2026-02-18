'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { fetchWithCsrf } from '@/lib/client-csrf'

interface PendingOrder {
  id: string
  orderNumber: string
  total: number
  paymentId: string
  updatedAt: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  items: Array<{
    id: string
    quantity: number
    product: { name: string }
  }>
  deliveryAddress: {
    name: string
    street: string
    city: string
    state: string
    pincode: string
  }
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<PendingOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN'

  const fetchPendingOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      if (res.status === 401) {
        router.push('/')
        return
      }
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {
      toast.error('Failed to load pending orders')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/orders')
      return
    }
    if (status === 'authenticated') {
      if (!isAdmin) {
        router.push('/')
        return
      }
      fetchPendingOrders()
    }
  }, [status, isAdmin, router, fetchPendingOrders])

  const handleVerify = async (orderId: string, action: 'approve' | 'reject') => {
    setProcessingId(orderId)
    try {
      const res = await fetchWithCsrf(`/api/admin/orders/${orderId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message)
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
      } else {
        toast.error(data.error || 'Action failed')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="mb-3 text-5xl animate-spin">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
            Payment Verification
          </h1>
          <p className="mt-1 text-gray-600">
            {orders.length === 0
              ? 'No payments awaiting verification'
              : `${orders.length} order${orders.length > 1 ? 's' : ''} awaiting verification`}
          </p>
        </div>
        <button
          onClick={fetchPendingOrders}
          className="flex items-center gap-2 rounded-full border-2 border-[hsl(var(--sienna))] bg-white px-4 py-2 text-sm font-semibold text-[hsl(var(--sienna))] transition-all hover:bg-[hsl(var(--cream))]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow">
          <div className="mb-4 text-7xl">✅</div>
          <h2 className="mb-2 font-serif text-2xl font-bold text-gray-800">All caught up!</h2>
          <p className="text-gray-500">No UPI payments waiting for verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow transition-all hover:shadow-md"
            >
              {/* Header row */}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-bold text-gray-800 text-lg">
                      Order #{order.orderNumber}
                    </span>
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                      Awaiting Verification
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Submitted {format(new Date(order.updatedAt), 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                    ₹{order.total}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-5">
                {/* Customer */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </p>
                  <p className="font-semibold text-gray-800">{order.user.name}</p>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                </div>

                {/* UPI Transaction ID */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    UPI Transaction ID
                  </p>
                  <p className="font-mono text-base font-bold text-blue-900 break-all select-all">
                    {order.paymentId}
                  </p>
                  <p className="mt-1 text-xs text-blue-600">Check your UPI app for this ID</p>
                </div>

                {/* Delivery Address */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.deliveryAddress.name}
                    <br />
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    <br />
                    {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-5 rounded-lg bg-gray-50 px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Items
                </p>
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-sm text-gray-700">
                      {item.product.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify(order.id, 'approve')}
                  disabled={processingId === order.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-bold text-white shadow transition-all hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5" />
                  {processingId === order.id ? 'Processing...' : 'Approve Payment'}
                </button>
                <button
                  onClick={() => handleVerify(order.id, 'reject')}
                  disabled={processingId === order.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-red-500 bg-white px-6 py-3 font-bold text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5" />
                  {processingId === order.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
