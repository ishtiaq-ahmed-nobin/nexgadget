import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        let mounted = true
        fetchProductById(id).then(p => { if (mounted) { setProduct(p); setLoading(false) } })
        return () => { mounted = false }
    }, [id])

    if (loading) return <div>Loading...</div>
    if (!product) return <div>Product not found</div>

    return (
        <div>
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} style={{ maxWidth: 420 }} />
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <button onClick={() => addToCart(product, 1)}>Add to cart</button>
        </div>
    )
}
