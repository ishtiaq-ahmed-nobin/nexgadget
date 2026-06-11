import { createContext, useContext, useState, useCallback } from 'react'

const CartDrawerContext = createContext(null)

export function CartDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartDrawerContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) throw new Error('useCartDrawer must be used within CartDrawerProvider')
  return ctx
}
