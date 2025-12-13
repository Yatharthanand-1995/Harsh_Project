'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useState } from 'react'

// Mock cart data (will be replaced with API calls)
const INITIAL_CART_ITEMS = [
  {
    id: '1',
    productId: '1',
    name: 'Artisan Sourdough Bread',
    price: 299,
    quantity: 2,
    thumbnail: '🥖',
    slug: 'artisan-sourdough-bread',
  },
  {
    id: '2',
    productId: '2',
    name: 'Chocolate Celebration Cake',
    price: 899,
    quantity: 1,
    thumbnail: '🎂',
    slug: 'chocolate-celebration-cake',
  },
  {
    id: '3',
    productId: '4',
    name: 'Gourmet Cookie Box',
    price: 599,
    quantity: 3,
    thumbnail: '🍪',
    slug: 'gourmet-cookie-box',
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS)

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(99, item.quantity + change))
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const deliveryFee = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.05) // 5% GST
  const total = subtotal + deliveryFee + tax

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
              {cartItems.length} item{cartItems.length !== 1 && 's'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
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
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] text-6xl transition-transform hover:scale-105"
                        >
                          {item.thumbnail}
                        </Link>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              className="mb-2 block font-serif text-xl font-bold text-[hsl(var(--sienna))] hover:text-[hsl(var(--saffron))]"
                            >
                              {item.name}
                            </Link>
                            <p className="mb-4 font-serif text-2xl font-bold text-gray-800">
                              ₹{item.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center rounded-full border-2 border-gray-300">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[2.5rem] text-center font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                                  disabled={item.quantity >= 99}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center gap-2 rounded-full px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                                aria-label="Remove from cart"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm font-semibold">Remove</span>
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                                ₹{item.price * item.quantity}
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
                        <span>Subtotal ({cartItems.length} items)</span>
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
