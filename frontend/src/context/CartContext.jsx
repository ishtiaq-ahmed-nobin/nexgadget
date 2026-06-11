import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [items, setItems] = useState([])

    function addToCart(product, quantity = 1) {
        setItems(prev => {
            const found = prev.find(i => i.product.id === product.id)
            if (found) {
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
            }
            return [...prev, { product, quantity }]
        })
    }

    function updateQuantity(productId, quantity) {
        setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
    }

    function removeFromCart(productId) {
        setItems(prev => prev.filter(i => i.product.id !== productId))
    }

    function clearCart() { setItems([]) }

    function getTotal() {
        return items.reduce((s, i) => s + (i.product.price || 0) * i.quantity, 0)
    }

    return (
        <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
