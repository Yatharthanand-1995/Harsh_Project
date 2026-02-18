'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProductActionsProps {
  productId: string
  productName: string
  price: number
  stock: number
}

export function ProductActions({ productId, productName, stock }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCartStore()
  const { status } = useSession()
  const router = useRouter()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/products/${encodeURIComponent(productId)}`)
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart(productId, quantity)

      // Show success message
      toast.success(`${productName} added to cart!`, {
        description: `Quantity: ${quantity}`,
      })

      // Reset quantity to 1 after adding
      setQuantity(1)
    } catch (error) {
      // Error already logged by API and displayed via toast
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart'
      toast.error('Failed to add to cart', {
        description: errorMessage,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.info('Wishlist feature coming soon!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out ${productName}`,
          url: window.location.href,
        })
      } catch {
        // Error sharing via Web Share API (user likely canceled)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border-2 border-gray-300">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="p-3 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="min-w-[3rem] text-center font-bold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= stock}
              className="p-3 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {quantity >= stock && (
            <span className="text-sm text-red-600">Max quantity reached</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || stock === 0}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--saffron))] py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <ShoppingCart className="h-5 w-5" />
          {isAddingToCart ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWishlist}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--sienna))] bg-white py-3 font-semibold text-[hsl(var(--sienna))] transition-all hover:bg-[hsl(var(--sienna))] hover:text-white"
          >
            <Heart className="h-5 w-5" />
            Wishlist
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--sienna))] bg-white py-3 font-semibold text-[hsl(var(--sienna))] transition-all hover:bg-[hsl(var(--sienna))] hover:text-white"
          >
            <Share2 className="h-5 w-5" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
