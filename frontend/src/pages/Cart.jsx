import React from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
    const { items, updateQuantity, removeFromCart, clearCart, getTotal } = useCart()

    if (items.length === 0) return (
        <div>
            <h2>Your cart is empty</h2>
            <Link to="/shop">Continue shopping</Link>
        </div>
    )

    return (
        <div>
            <h2>Your Cart</h2>
            {items.map(i => (
                <div key={i.product.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={i.product.image} alt={i.product.name} style={{ width: 80 }} />
                    <div style={{ flex: 1 }}>
                        <div>{i.product.name}</div>
                        <div>${i.product.price}</div>
                        <input type="number" value={i.quantity} min={1} onChange={e => updateQuantity(i.product.id, parseInt(e.target.value || 1))} />
                        <button onClick={() => removeFromCart(i.product.id)}>Remove</button>
                    </div>
                </div>
            ))}
            <div>
                <strong>Total: ${getTotal().toFixed(2)}</strong>
            </div>
            <div>
                <button onClick={clearCart}>Clear</button>
                <Link to="/checkout"><button>Checkout</button></Link>
            </div>
        </div>
    )
}
