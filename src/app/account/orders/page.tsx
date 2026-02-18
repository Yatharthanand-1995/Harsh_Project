'use client'

import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

function SuccessToast() {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Transaction ID submitted! Your payment is being verified.')
    }
  }, [searchParams])
  return null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentId?: string | null
  total: number
  createdAt: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    product: {
      name: string
      thumbnail: string
    }
  }>
  deliveryAddress: {
    name: string
    street: string
    city: string
    state: string
    pincode: string
  }
}

export default function OrdersPage() {
  const { status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')

      const data = await response.json()
      setOrders(data.orders || [])
    } catch {
      setError('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus.toUpperCase()) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
            ✓ Payment Confirmed
          </span>
        )
      case 'VERIFICATION_PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
            🔍 Verifying Payment
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
            ⏳ Payment Pending
          </span>
        )
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
            ✗ Payment Rejected — Please resubmit
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
            {paymentStatus}
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
        <div className="mb-4 text-6xl">⏳</div>
        <div className="text-lg font-semibold">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
        <div className="mb-4 text-6xl">❌</div>
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
        <div className="mb-6 text-8xl">📦</div>
        <h2 className="mb-4 font-serif text-3xl font-bold text-gray-800">
          No orders yet
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Start shopping to see your orders here
        </p>
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <Package className="h-5 w-5" />
          Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
          Order History
        </h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border-2 border-gray-200 p-6 transition-all hover:border-[hsl(var(--sienna))] hover:shadow-md"
            >
              {/* Order Header */}
              <div className="mb-4 border-b pb-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Package className="h-5 w-5 text-[hsl(var(--sienna))]" />
                      <span className="font-bold text-gray-800">
                        Order #{order.orderNumber}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-serif text-xl font-bold text-[hsl(var(--sienna))]">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>

                {/* Transaction ID Display */}
                {order.paymentId && (
                  <div className="mt-3 rounded-lg bg-blue-50 p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      UPI Transaction ID:
                    </p>
                    <p className="font-mono text-sm text-blue-800 break-all">
                      {order.paymentId}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-1 text-sm font-semibold text-gray-700">Delivery Address</p>
                <p className="text-sm text-gray-600">
                  {order.deliveryAddress.name}<br />
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}<br />
                  {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
