import { create } from 'zustand'
import { debounce } from '@/lib/utils/debounce'
import { CART } from '@/lib/constants'

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
  cart: CartItem[] // Alias for items for convenience
  subtotal: number
  itemCount: number
  isLoading: boolean
  error: string | null

  // Actions
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  updateQuantityOptimistic: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => Promise<void>
  removeItemOptimistic: (itemId: string) => void
  clearError: () => void
}

// Store debounced update functions per item
const debouncedUpdates = new Map<string, ReturnType<typeof debounce>>()

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  get cart() {
    return get().items
  },
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

  updateQuantityOptimistic: (itemId: string, quantity: number) => {
    const state = get()
    const updatedItems = state.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    )

    // Calculate new subtotal and item count
    const newSubtotal = updatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const newItemCount = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    )

    // Update state optimistically
    set({
      items: updatedItems,
      subtotal: newSubtotal,
      itemCount: newItemCount,
    })

    // Get or create debounced update function for this item
    if (!debouncedUpdates.has(itemId)) {
      const debouncedFn = debounce(
        async (id: string, qty: number) => {
          try {
            const response = await fetch(`/api/cart/${id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ quantity: qty }),
            })

            if (!response.ok) {
              const data = await response.json()
              throw new Error(data.error || 'Failed to update quantity')
            }

            // Sync with server after successful update
            await get().fetchCart()
          } catch (error) {
            // Rollback on error - fetch cart to get correct state
            await get().fetchCart()
            set({
              error: error instanceof Error ? error.message : 'Failed to update quantity',
            })
          }
        },
        CART.UPDATE_DEBOUNCE_MS
      )
      debouncedUpdates.set(itemId, debouncedFn)
    }

    // Call debounced update
    const debouncedFn = debouncedUpdates.get(itemId)!
    debouncedFn(itemId, quantity)
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    // For non-optimistic updates (backward compatibility)
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

  removeItemOptimistic: (itemId: string) => {
    const state = get()

    // Store previous state for rollback
    const previousItems = state.items
    const previousSubtotal = state.subtotal
    const previousItemCount = state.itemCount

    // Remove item optimistically
    const updatedItems = state.items.filter(item => item.id !== itemId)

    // Calculate new subtotal and item count
    const newSubtotal = updatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const newItemCount = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    )

    // Update state optimistically
    set({
      items: updatedItems,
      subtotal: newSubtotal,
      itemCount: newItemCount,
    })

    // Perform actual API call
    fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to remove item')
        }
        // Sync with server after successful removal
        await get().fetchCart()
      })
      .catch((error) => {
        // Rollback on error
        set({
          items: previousItems,
          subtotal: previousSubtotal,
          itemCount: previousItemCount,
          error: error instanceof Error ? error.message : 'Failed to remove item',
        })
      })
  },

  removeItem: async (itemId: string) => {
    // For non-optimistic removes (backward compatibility)
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
