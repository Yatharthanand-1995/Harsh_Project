import { create } from 'zustand'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    thumbnail: string
    stock: number
    images: string[]
    shortDesc: string | null
  }
}

interface CartState {
  items: CartItem[]
  subtotal: number
  itemCount: number
  isLoading: boolean
  error: string | null

  // Actions
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearError: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/cart')

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, clear cart
          set({ items: [], subtotal: 0, itemCount: 0, isLoading: false })
          return
        }
        throw new Error('Failed to fetch cart')
      }

      const data = await response.json()
      set({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        itemCount: data.itemCount || 0,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cart',
        isLoading: false,
      })
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add to cart')
      }

      // Refresh cart after adding
      await get().fetchCart()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to cart',
        isLoading: false,
      })
      throw error
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update quantity')
      }

      // Refresh cart after updating
      await get().fetchCart()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update quantity',
        isLoading: false,
      })
      throw error
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove item')
      }

      // Refresh cart after removing
      await get().fetchCart()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove item',
        isLoading: false,
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
