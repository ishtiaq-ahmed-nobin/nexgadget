import { createSlice } from '@reduxjs/toolkit'

const savedItems = localStorage.getItem('cartItems')

const initialState = {
  items: savedItems ? JSON.parse(savedItems) : [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((i) => i.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.product.id === productId)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.product.id !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cartItems')
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0)
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

export default cartSlice.reducer
