'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { AddressForm } from '@/components/address-form'
import { toast } from 'sonner'
import { fetchWithCsrf } from '@/lib/client-csrf'

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

export default function AddressesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchAddresses()
    }
  }, [status, router])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (!response.ok) throw new Error('Failed to fetch addresses')

      const data = await response.json()
      setAddresses(data.addresses || [])
    } catch (err) {
      toast.error('Failed to load addresses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (addressData: any) => {
    try {
      const response = await fetchWithCsrf('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) throw new Error('Failed to add address')

      toast.success('Address added successfully')
      setShowAddressForm(false)
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to add address')
    }
  }

  const handleEditAddress = async (addressData: any) => {
    if (!editingAddress) return

    try {
      const response = await fetchWithCsrf(`/api/addresses/${editingAddress.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) throw new Error('Failed to update address')

      toast.success('Address updated successfully')
      setEditingAddress(null)
      setShowAddressForm(false)
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to update address')
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetchWithCsrf(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete address')

      toast.success('Address deleted successfully')
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetchWithCsrf(`/api/addresses/${addressId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      })

      if (!response.ok) throw new Error('Failed to set default address')

      toast.success('Default address updated')
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to update default address')
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
        <div className="mb-4 text-6xl">⏳</div>
        <div className="text-lg font-semibold">Loading addresses...</div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
              Saved Addresses
            </h2>
            <button
              onClick={() => {
                setEditingAddress(null)
                setShowAddressForm(true)
              }}
              className="flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-4 py-2 font-semibold text-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-6 text-8xl">📍</div>
              <h3 className="mb-4 font-serif text-2xl font-bold text-gray-800">
                No addresses yet
              </h3>
              <p className="mb-8 text-gray-600">
                Add your first delivery address
              </p>
              <button
                onClick={() => setShowAddressForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`rounded-xl border-2 p-6 transition-all ${
                    address.isDefault
                      ? 'border-[hsl(var(--sienna))] bg-[hsl(var(--cream))]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-1 h-5 w-5 text-[hsl(var(--sienna))]" />
                      <div>
                        <p className="mb-1 font-bold text-gray-800">{address.name}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                    </div>
                    {address.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>

                  <div className="mb-4 text-sm text-gray-700">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>{address.pincode}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address)
                        setShowAddressForm(true)
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[hsl(var(--sienna))] bg-white px-3 py-2 text-sm font-semibold text-[hsl(var(--sienna))] transition-all hover:bg-[hsl(var(--cream))]"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="rounded-lg border-2 border-red-300 bg-white px-3 py-2 text-red-600 transition-all hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          {...(editingAddress && { initialData: editingAddress })}
          onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
          onCancel={() => {
            setShowAddressForm(false)
            setEditingAddress(null)
          }}
        />
      )}
    </>
  )
}
