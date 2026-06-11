import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/api'

export default function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        fetchProducts().then(data => { if (mounted) { setProducts(data || []); setLoading(false) } })
        return () => { mounted = false }
    }, [])

    if (loading) return <div>Loading products...</div>

    return (
        <div>
            <h2>Shop</h2>
            <div className="product-grid">
                {products.map(p => (
                    <div className="card" key={p.id}>
                        <img src={p.image || '/placeholder.png'} alt={p.name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6 }} />
                        <h3>{p.name}</h3>
                        <p>{p.short_description || ''}</p>
                        <div>
                            <strong>${p.price}</strong>
                        </div>
                        <Link to={`/product/${p.id}`}>View</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
