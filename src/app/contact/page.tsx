import { Mail, Instagram, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Us | Homespun',
  description: 'Get in touch with Homespun for orders, inquiries, or custom requests.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--warm-beige))] to-[hsl(var(--cream))]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--sienna))] to-[#704010] text-[hsl(var(--cream))] py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-[hsl(var(--cream))]/90 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out for orders, inquiries, or custom requests.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-[hsl(var(--sienna))]/10 p-4 rounded-full">
                  <Mail className="w-8 h-8 text-[hsl(var(--sienna))]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-bold text-[hsl(var(--sienna))] mb-2">
                    Email Us
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <a
                    href="mailto:harsh.homespun@gmail.com"
                    className="text-[hsl(var(--sienna))] font-semibold hover:underline text-lg"
                  >
                    harsh.homespun@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-[hsl(var(--sienna))]/10 p-4 rounded-full">
                  <Instagram className="w-8 h-8 text-[hsl(var(--sienna))]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-bold text-[hsl(var(--sienna))] mb-2">
                    Follow Us
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Stay updated with our latest products and offers.
                  </p>
                  <a
                    href="https://instagram.com/homespun_bakery_gifts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--sienna))] font-semibold hover:underline text-lg inline-flex items-center gap-2"
                  >
                    @homespun_bakery_gifts
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="font-serif text-3xl font-bold text-[hsl(var(--sienna))] mb-2 text-center">
              Send Us a Message
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Have a question or special request? Fill out the form below and we'll respond shortly.
            </p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--sienna))] focus:border-transparent outline-none transition"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--sienna))] focus:border-transparent outline-none transition"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--sienna))] focus:border-transparent outline-none transition"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[hsl(var(--sienna))] focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[hsl(var(--sienna))] text-[hsl(var(--cream))] px-12 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-shadow"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg">
              For bulk orders or corporate gifting inquiries,{' '}
              <a
                href="mailto:harsh.homespun@gmail.com?subject=Bulk Order Inquiry"
                className="text-[hsl(var(--sienna))] font-semibold hover:underline"
              >
                reach out directly
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
