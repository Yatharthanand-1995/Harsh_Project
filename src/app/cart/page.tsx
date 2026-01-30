'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useSession } from 'next-auth/react'
import { PRICING } from '@/lib/constants'

export default function CartPage() {
  const { data: session, status } = useSession()
  const {
    items,
    subtotal,
    itemCount,
    isLoading,
    error,
    fetchCart,
    updateQuantityOptimistic,
    removeItemOptimistic,
    clearError
  } = useCartStore()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart()
    }
    // fetchCart is a stable reference from Zustand, safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handleUpdateQuantity = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) return

    // Use optimistic update with debouncing
    updateQuantityOptimistic(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string) => {
    // Use optimistic remove
    removeItemOptimistic(itemId)
  }

  // Memoize expensive calculations
  const { deliveryFee, tax, total } = useMemo(() => {
    const delivery = subtotal >= PRICING.FREE_DELIVERY_THRESHOLD ? 0 : PRICING.DELIVERY_FEE
    const taxAmount = Math.round(subtotal * PRICING.GST_RATE)
    const totalAmount = subtotal + delivery + taxAmount

    return {
      deliveryFee: delivery,
      tax: taxAmount,
      total: totalAmount,
    }
  }, [subtotal])

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
              <div className="mb-6 text-8xl">🔒</div>
              <h2 className="mb-4 font-serif text-3xl font-bold text-gray-800">
                Sign in to view your cart
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Please sign in to see your cart items and checkout
              </p>
              <Link
                href="/login?callbackUrl=/cart"
                className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Sign In
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="mb-2 font-serif text-4xl font-bold text-[hsl(var(--sienna))]">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
              <div className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="text-sm font-semibold underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {isLoading && items.length === 0 ? (
            /* Loading State */
            <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
              <div className="mb-6 text-6xl">⏳</div>
              <h2 className="font-serif text-2xl font-bold text-gray-800">
                Loading your cart...
              </h2>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart State */
            <div className="rounded-3xl bg-white p-16 text-center shadow-lg">
              <div className="mb-6 text-8xl">🛒</div>
              <h2 className="mb-4 font-serif text-3xl font-bold text-gray-800">
                Your cart is empty
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--sienna))] px-8 py-4 font-bold text-[hsl(var(--cream))] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <ShoppingBag className="h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] transition-transform hover:scale-105"
                        >
                          <Image
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="mb-2 block font-serif text-base sm:text-lg font-bold text-[hsl(var(--sienna))] hover:text-[hsl(var(--saffron))]"
                            >
                              {item.product.name}
                            </Link>
                            {item.product.shortDesc && (
                              <p className="mb-2 text-sm text-gray-600">
                                {item.product.shortDesc}
                              </p>
                            )}
                            <p className="mb-4 font-serif text-2xl font-bold text-gray-800">
                              ₹{item.product.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex items-center rounded-full border-2 border-gray-300">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, item.quantity, -1)
                                  }
                                  className="p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={item.quantity <= 1 || isLoading}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[2.5rem] text-center font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, item.quantity, 1)
                                  }
                                  className="p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={
                                    item.quantity >= item.product.stock || isLoading
                                  }
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="flex items-center gap-2 rounded-full px-4 py-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isLoading}
                                aria-label="Remove from cart"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm font-semibold">Remove</span>
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                                ₹{item.product.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-[hsl(var(--sienna))] transition-colors hover:text-[hsl(var(--saffron))]"
                  >
                    <span className="font-semibold">← Continue Shopping</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <h2 className="mb-6 font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      {/* Subtotal */}
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal ({itemCount} items)</span>
                        <span className="font-semibold">₹{subtotal}</span>
                      </div>

                      {/* Delivery Fee */}
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery Fee</span>
                        {deliveryFee === 0 ? (
                          <span className="font-semibold text-green-600">FREE</span>
                        ) : (
                          <span className="font-semibold">₹{deliveryFee}</span>
                        )}
                      </div>

                      {/* Free Delivery Message */}
                      {subtotal < 500 && (
                        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                          Add ₹{500 - subtotal} more for free delivery!
                        </div>
                      )}

                      {/* Tax */}
                      <div className="flex justify-between text-gray-700">
                        <span>Tax (GST 5%)</span>
                        <span className="font-semibold">₹{tax}</span>
                      </div>

                      <div className="border-t-2 border-gray-200 pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-gray-800">Total</span>
                          <span className="font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
                            ₹{total}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Inclusive of all taxes
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                      href="/checkout"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--saffron))] py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5" />
                    </Link>

                    {/* Security Badge */}
                    <div className="mt-6 rounded-lg bg-green-50 p-4 text-center">
                      <div className="mb-2 text-2xl">🔒</div>
                      <p className="text-sm font-semibold text-green-800">
                        Secure Checkout
                      </p>
                      <p className="text-xs text-green-600">
                        Your payment information is safe
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] p-6">
                    <h3 className="mb-4 font-bold text-gray-800">Why Shop With Us?</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Same-day delivery available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Freshly baked daily</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>100% quality guarantee</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Secure payment options</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
