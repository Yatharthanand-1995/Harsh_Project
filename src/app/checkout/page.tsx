'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AddressSelector } from '@/components/address-selector'
import { AddressForm } from '@/components/address-form'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, CreditCard, Truck } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { PRICING } from '@/lib/constants'
import { toast } from 'sonner'
import { fetchWithCsrf } from '@/lib/client-csrf'

// Generate a unique idempotency key for this checkout session
function generateIdempotencyKey(): string {
  return `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, fetchCart, isLoading } = useCartStore()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [idempotencyKey] = useState(() => generateIdempotencyKey())
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliverySlot: 'morning',
    deliveryNotes: '',
    giftMessage: '',
    isGift: false,
  })

  // Fetch cart on mount
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Calculate totals using memoization
  const { subtotal, deliveryFee, tax, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const delivery = sub >= PRICING.FREE_DELIVERY_THRESHOLD ? 0 : PRICING.DELIVERY_FEE
    const taxAmount = Math.round(sub * PRICING.GST_RATE)
    const totalAmount = sub + delivery + taxAmount

    return {
      subtotal: sub,
      deliveryFee: delivery,
      tax: taxAmount,
      total: totalAmount,
    }
  }, [cart])

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && cart.length === 0) {
      router.push('/cart')
    }
  }, [cart, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate step 1 - address selection
    if (step === 1 && !selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }

    if (step < 3) {
      setStep(step + 1)
    } else {
      await handlePayment()
    }
  }

  const handleAddressSubmit = async (addressData: any) => {
    try {
      const response = await fetchWithCsrf('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        throw new Error('Failed to save address')
      }

      const { address } = await response.json()
      setSelectedAddressId(address.id)
      setShowAddressForm(false)
      toast.success('Address saved successfully')
    } catch (error) {
      toast.error('Failed to save address. Please try again.')
    }
  }

  const handlePayment = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address')
      setStep(1)
      return
    }

    setIsProcessing(true)

    try {
      // Create order with idempotency key
      const orderResponse = await fetchWithCsrf('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          deliverySlot: formData.deliverySlot,
          deliveryDate: formData.deliveryDate,
          deliveryNotes: formData.deliveryNotes,
          giftMessage: formData.giftMessage,
          isGift: formData.isGift,
          idempotencyKey,
        }),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await orderResponse.json()

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.total * 100,
        currency: 'INR',
        name: 'Homespun',
        description: `Order #${order.orderNumber}`,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetchWithCsrf('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.orderNumber,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            if (verifyResponse.ok) {
              toast.success('Payment successful!')
              router.push(`/orders?success=true`)
            } else {
              toast.error('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        theme: {
          color: '#8B4513',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const deliverySlots = [
    { id: 'morning', label: 'Morning (8 AM - 12 PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12 PM - 4 PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (4 PM - 8 PM)', icon: '🌆' },
    { id: 'midnight', label: 'Midnight (11 PM - 1 AM)', icon: '🌙', extra: '+₹100' },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-4 text-lg font-semibold">Loading checkout...</div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Show empty cart message if no items
  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-4 text-lg font-semibold">Your cart is empty</div>
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
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: 'Address' },
                { num: 2, label: 'Delivery' },
                { num: 3, label: 'Payment' },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                        step >= s.num
                          ? 'bg-[hsl(var(--sienna))] text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {s.num}
                    </div>
                    <span className="mt-2 text-sm font-semibold">{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`mx-4 h-1 w-24 ${
                        step > s.num ? 'bg-[hsl(var(--sienna))]' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  {/* Step 1: Address Selection */}
                  {step === 1 && (
                    <div>
                      <h2 className="mb-6 font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
                        Select Delivery Address
                      </h2>
                      <AddressSelector
                        selectedAddressId={selectedAddressId}
                        onAddressSelect={setSelectedAddressId}
                        onAddAddress={() => setShowAddressForm(true)}
                      />
                    </div>
                  )}

                  {/* Step 2: Delivery */}
                  {step === 2 && (
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <Truck className="h-8 w-8 text-[hsl(var(--sienna))]" />
                        <h2 className="font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
                          Delivery Details
                        </h2>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            <Calendar className="mb-1 inline h-4 w-4" /> Delivery Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.deliveryDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) =>
                              setFormData({ ...formData, deliveryDate: e.target.value })
                            }
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-3 block text-sm font-semibold text-gray-700">
                            <Clock className="mb-1 inline h-4 w-4" /> Delivery Time Slot *
                          </label>
                          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                            {deliverySlots.map((slot) => (
                              <label
                                key={slot.id}
                                className={`flex cursor-pointer items-center gap-3 sm:gap-4 rounded-xl border-2 p-3 sm:p-4 transition-all ${
                                  formData.deliverySlot === slot.id
                                    ? 'border-[hsl(var(--sienna))] bg-[hsl(var(--cream))]'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="deliverySlot"
                                  value={slot.id}
                                  checked={formData.deliverySlot === slot.id}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      deliverySlot: e.target.value,
                                    })
                                  }
                                  className="h-6 w-6 sm:h-5 sm:w-5"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{slot.icon}</span>
                                    <span className="font-semibold">{slot.label}</span>
                                  </div>
                                  {slot.extra && (
                                    <span className="text-sm text-[hsl(var(--saffron))]">
                                      {slot.extra}
                                    </span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Delivery Notes (Optional)
                          </label>
                          <textarea
                            value={formData.deliveryNotes}
                            onChange={(e) =>
                              setFormData({ ...formData, deliveryNotes: e.target.value })
                            }
                            rows={3}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                            placeholder="Any special instructions for delivery..."
                          />
                        </div>

                        <div className="rounded-xl border-2 border-dashed border-gray-300 p-4">
                          <label className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={formData.isGift}
                              onChange={(e) =>
                                setFormData({ ...formData, isGift: e.target.checked })
                              }
                              className="mt-1 h-5 w-5"
                            />
                            <div>
                              <span className="font-semibold text-gray-800">
                                This is a gift 🎁
                              </span>
                              <p className="mt-1 text-sm text-gray-600">
                                We&apos;ll include a personalized message card
                              </p>
                            </div>
                          </label>

                          {formData.isGift && (
                            <textarea
                              value={formData.giftMessage}
                              onChange={(e) =>
                                setFormData({ ...formData, giftMessage: e.target.value })
                              }
                              rows={3}
                              className="mt-4 w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                              placeholder="Write your gift message here... (max 200 characters)"
                              maxLength={200}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-[hsl(var(--sienna))]" />
                        <h2 className="font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
                          Payment Method
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {[
                          { id: 'razorpay', name: 'Cards / UPI / Wallets', icon: '💳' },
                          { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
                        ].map((method) => (
                          <label
                            key={method.id}
                            className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-gray-300 p-6 transition-all hover:border-[hsl(var(--sienna))] hover:bg-[hsl(var(--cream))]"
                          >
                            <input
                              type="radio"
                              name="payment"
                              defaultChecked={method.id === 'razorpay'}
                              className="h-5 w-5"
                            />
                            <div className="flex flex-1 items-center gap-3">
                              <span className="text-4xl">{method.icon}</span>
                              <span className="font-semibold text-gray-800">
                                {method.name}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className="mt-6 rounded-xl bg-blue-50 p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="text-3xl">🔒</div>
                          <h3 className="font-bold text-blue-900">Secure Payment</h3>
                        </div>
                        <p className="text-sm text-blue-800">
                          Your payment information is encrypted and secure. We never
                          store your card details.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex gap-4">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="rounded-full border-2 border-[hsl(var(--sienna))] bg-white px-8 py-3 font-bold text-[hsl(var(--sienna))] transition-all hover:bg-[hsl(var(--sienna))] hover:text-white"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isProcessing ? 'Processing...' : step === 3 ? 'Place Order & Pay' : 'Continue'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-6 font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
                  Order Summary
                </h3>

                <div className="mb-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))]">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-bold text-[hsl(var(--sienna))]">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t-2 pt-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    {deliveryFee === 0 ? (
                      <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold">₹{deliveryFee}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>
                  <div className="border-t-2 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          onSubmit={handleAddressSubmit}
          onCancel={() => setShowAddressForm(false)}
        />
      )}
    </>
  )
}
