'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useState } from 'react'
import { Calendar, Clock, MapPin, CreditCard, Truck } from 'lucide-react'

// Mock cart data
const CART_ITEMS = [
  {
    id: '1',
    name: 'Artisan Sourdough Bread',
    price: 299,
    quantity: 2,
    thumbnail: '🥖',
  },
  {
    id: '2',
    name: 'Chocolate Celebration Cake',
    price: 899,
    quantity: 1,
    thumbnail: '🎂',
  },
]

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Address
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    // Delivery
    deliveryDate: '',
    deliverySlot: 'morning',
    deliveryNotes: '',
    giftMessage: '',
    isGift: false,
  })

  const subtotal = CART_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const deliveryFee = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Process payment
      alert('Processing payment...')
    }
  }

  const deliverySlots = [
    { id: 'morning', label: 'Morning (8 AM - 12 PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12 PM - 4 PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (4 PM - 8 PM)', icon: '🌆' },
    { id: 'midnight', label: 'Midnight (11 PM - 1 AM)', icon: '🌙', extra: '+₹100' },
  ]

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
                  {/* Step 1: Address */}
                  {step === 1 && (
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <MapPin className="h-8 w-8 text-[hsl(var(--sienna))]" />
                        <h2 className="font-serif text-3xl font-bold text-[hsl(var(--sienna))]">
                          Delivery Address
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              required
                              pattern="[0-9]{10}"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                              placeholder="9876543210"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.street}
                            onChange={(e) =>
                              setFormData({ ...formData, street: e.target.value })
                            }
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                            placeholder="123 Main Street, Apartment 4B"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.city}
                              onChange={(e) =>
                                setFormData({ ...formData, city: e.target.value })
                              }
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                              placeholder="Mumbai"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              State *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.state}
                              onChange={(e) =>
                                setFormData({ ...formData, state: e.target.value })
                              }
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                              placeholder="Maharashtra"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              pattern="[0-9]{6}"
                              value={formData.pincode}
                              onChange={(e) =>
                                setFormData({ ...formData, pincode: e.target.value })
                              }
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
                              placeholder="400001"
                            />
                          </div>
                        </div>
                      </div>
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
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {deliverySlots.map((slot) => (
                              <label
                                key={slot.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
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
                                  className="h-5 w-5"
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
                      className="flex-1 rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      {step === 3 ? 'Place Order & Pay' : 'Continue'}
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
                  {CART_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--warm-beige))] text-3xl">
                        {item.thumbnail}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-bold text-[hsl(var(--sienna))]">
                          ₹{item.price * item.quantity}
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
    </>
  )
}
