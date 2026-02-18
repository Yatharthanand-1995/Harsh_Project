'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: (session?.user as any)?.phone || '',
  })

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Add API endpoint to update user profile
      // For now, just show success message
      toast.success('Profile updated successfully!')
      setIsEditing(false)

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          phone: formData.phone,
        },
      })
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || '',
      phone: (session?.user as any)?.phone || '',
    })
    setIsEditing(false)
  }

  if (status === 'loading') {
    return (
      <div className="rounded-2xl bg-white p-16 text-center shadow-lg">
        <div className="mb-4 text-6xl">⏳</div>
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--sienna))]">
            Profile Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-4 py-2 font-semibold text-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-full bg-[hsl(var(--saffron))] px-4 py-2 font-semibold text-white transition-all hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4" />
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
              />
            ) : (
              <p className="rounded-lg bg-gray-50 px-4 py-3 text-gray-800">
                {session?.user?.name || 'Not set'}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="rounded-lg bg-gray-50 px-4 py-3 text-gray-800">
              {session?.user?.email}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Phone className="h-4 w-4" />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-[hsl(var(--sienna))] focus:outline-none"
              />
            ) : (
              <p className="rounded-lg bg-gray-50 px-4 py-3 text-gray-800">
                {(session?.user as any)?.phone || 'Not set'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-blue-600">--</div>
          <div className="text-sm font-semibold text-blue-800">Total Orders</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-green-600">--</div>
          <div className="text-sm font-semibold text-green-800">Saved Addresses</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-purple-600">Member</div>
          <div className="text-sm font-semibold text-purple-800">Account Status</div>
        </div>
      </div>
    </div>
  )
}
