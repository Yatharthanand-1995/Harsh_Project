'use client'

import { useState, useEffect } from 'react'
import { MapPin, Plus, Check } from 'lucide-react'

interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface AddressSelectorProps {
  selectedAddressId: string | null
  onAddressSelect: (addressId: string) => void
  onAddAddress: () => void
}

export function AddressSelector({
  selectedAddressId,
  onAddressSelect,
  onAddAddress,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/addresses')

      if (!response.ok) {
        throw new Error('Failed to fetch addresses')
      }

      const data = await response.json()
      setAddresses(data.addresses)

      // Auto-select default address if no address is selected
      if (!selectedAddressId && data.addresses.length > 0) {
        const defaultAddress = data.addresses.find((a: Address) => a.isDefault) || data.addresses[0]
        onAddressSelect(defaultAddress.id)
      }
    } catch (err) {
      setError('Failed to load addresses')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border-2 border-gray-200 p-4">
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    )
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">No delivery addresses saved yet</p>
        <button
          onClick={onAddAddress}
          className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-6 py-2 font-semibold text-white hover:bg-opacity-90 transition-colors"
        >
          <Plus size={20} />
          Add Delivery Address
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          onClick={() => onAddressSelect(address.id)}
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
            selectedAddressId === address.id
              ? 'border-[hsl(var(--saffron))] bg-[hsl(var(--cream))]'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <MapPin
                className={`mt-1 ${
                  selectedAddressId === address.id
                    ? 'text-[hsl(var(--saffron))]'
                    : 'text-gray-400'
                }`}
                size={20}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{address.name}</p>
                  {address.isDefault && (
                    <span className="rounded-full bg-[hsl(var(--saffron))] px-2 py-0.5 text-xs text-white">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {address.street}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
            </div>
            {selectedAddressId === address.id && (
              <div className="flex-shrink-0">
                <div className="rounded-full bg-[hsl(var(--saffron))] p-1">
                  <Check size={16} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={onAddAddress}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center font-semibold text-gray-600 hover:border-[hsl(var(--saffron))] hover:text-[hsl(var(--saffron))] transition-colors"
      >
        <Plus size={20} className="inline mr-2" />
        Add New Address
      </button>
    </div>
  )
}
