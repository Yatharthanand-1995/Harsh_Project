'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddressFormData {
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<AddressFormData>
  isEdit?: boolean
}

export function AddressForm({ onSubmit, onCancel, initialData, isEdit = false }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    isDefault: initialData?.isDefault || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.match(/^[0-9]{10}$/)) newErrors.phone = 'Phone must be 10 digits'
    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be 6 digits'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting address:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>

        <h2 className="font-serif text-2xl font-bold text-[hsl(var(--sienna))] mb-6">
          {isEdit ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[hsl(var(--saffron))]'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
                  errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[hsl(var(--saffron))]'
                }`}
                placeholder="9876543210"
                maxLength={10}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              id="street"
              name="street"
              type="text"
              value={formData.street}
              onChange={handleChange}
              className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
                errors.street ? 'border-red-500' : 'border-gray-300 focus:border-[hsl(var(--saffron))]'
              }`}
              placeholder="123 Main Street, Apt 4B"
            />
            {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
                  errors.city ? 'border-red-500' : 'border-gray-300 focus:border-[hsl(var(--saffron))]'
                }`}
                placeholder="Mumbai"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                State *
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
                  errors.state ? 'border-red-500' : 'border-gray-300 focus:border-[hsl(var(--saffron))]'
                }`}
                placeholder="Maharashtra"
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300 focus:border-[hsl(var(--saffron))]'
                }`}
                placeholder="400001"
                maxLength={6}
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="isDefault"
              name="isDefault"
              type="checkbox"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[hsl(var(--saffron))] focus:ring-[hsl(var(--saffron))]"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Set as default delivery address
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-[hsl(var(--saffron))] py-3 font-semibold text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
