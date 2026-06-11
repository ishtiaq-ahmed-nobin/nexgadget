import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'

export default function Checkout() {
    const { items, getTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)
    const [form, setForm] = useState({ name: '', email: '', address: '' })

    const handlePlaceOrder = async () => {
        setLoading(true)
        try {
            const payload = { customer: form, items, total: getTotal() }
            const res = await createOrder(payload)
            setSuccess(res)
            clearCart()
        } catch (err) {
            console.error(err)
            setSuccess({ error: true, message: 'Order failed' })
        } finally { setLoading(false) }
    }

    if (success) return <div>Order placed: {JSON.stringify(success)}</div>

    return (
        <div>
            <h2>Checkout</h2>
            <div>
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
                <label>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
                <label>Address</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
                <strong>Total: ${getTotal().toFixed(2)}</strong>
            </div>
            <button onClick={handlePlaceOrder} disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
        </div>
    )
}
