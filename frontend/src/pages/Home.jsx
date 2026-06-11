import React, { useEffect, useState } from 'react'
import { fetchProducts, fetchCategories } from '../services/api'
import { Link } from 'react-router-dom'

export default function Home() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchProducts().then(setProducts)
        fetchCategories().then(setCategories)
    }, [])

    return (
        <div>
            {/* 1. Hero */}
            <section className="section hero">
                <div className="hero-copy">
                    <h1>NexGadget — Modern Gadgets, Smarter Shopping</h1>
                    <p className="muted">Discover top smartphones, laptops, wearables and accessories with real-time inventory and secure payments.</p>
                    <div style={{ marginTop: 16 }}>
                        <Link to="/shop"><button className="btn">Shop Now</button></Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/placeholder.png" alt="hero" style={{ width: '100%', borderRadius: 10 }} />
                </div>
            </section>

            {/* 2. Featured Products */}
            <section className="section">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    {products.slice(0, 4).map(p => (
                        <div className="card" key={p.id}>
                            <img src={p.image || '/placeholder.png'} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6 }} />
                            <h3>{p.name}</h3>
                            <div className="muted">${p.price}</div>
                            <Link to={`/product/${p.id}`}>View</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Categories */}
            <section className="section">
                <h2>Categories</h2>
                <div className="categories">
                    {categories.map(c => <div className="category-pill" key={c.id}>{c.name}</div>)}
                </div>
            </section>

            {/* 4. Trending */}
            <section className="section">
                <h2>Trending Now</h2>
                <div className="grid-3">
                    {products.slice(0, 6).map(p => (
                        <div className="card" key={p.id}>
                            <h4>{p.name}</h4>
                            <div className="muted">${p.price}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Services / Support */}
            <section className="section">
                <h2>Services</h2>
                <div className="grid-3">
                    <div className="card">Inventory Management Tools</div>
                    <div className="card">Order Processing & Tracking</div>
                    <div className="card">Secure Payments & Verification</div>
                </div>
            </section>

            {/* 6. About */}
            <section className="section">
                <h2>About NexGadget</h2>
                <p className="muted">NexGadget provides a modern e-commerce platform with integrated inventory management, reporting, and analytics for gadget retailers.</p>
            </section>

            {/* 7. Inventory Highlights */}
            <section className="section">
                <h2>Inventory Highlights</h2>
                <div className="stats">
                    <div className="stat"><strong>1200+</strong><div className="muted">Products</div></div>
                    <div className="stat"><strong>50+</strong><div className="muted">Categories</div></div>
                    <div className="stat"><strong>24/7</strong><div className="muted">Stock Monitoring</div></div>
                </div>
            </section>

            {/* 8. Payment Methods */}
            <section className="section">
                <h2>Payment Methods</h2>
                <div className="grid-3">
                    <div className="card">bKash / Nagad</div>
                    <div className="card">SSLCommerz Gateway</div>
                    <div className="card">Card Payments (Visa / MC)</div>
                </div>
            </section>

            {/* 9. Testimonials */}
            <section className="section">
                <h2>Customer Testimonials</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
                    <div className="testimonial">Great selection and fast shipping — 5/5</div>
                    <div className="testimonial">Inventory alerts saved us — 4.8/5</div>
                </div>
            </section>

            {/* 10. Reports Preview */}
            <section className="section">
                <h2>Reports & Analytics</h2>
                <p className="muted">Daily, monthly and yearly sales analytics; exportable to PDF/CSV.</p>
            </section>

            {/* 11. Newsletter */}
            <section className="section newsletter">
                <h2>Subscribe for Updates</h2>
                <div>
                    <input placeholder="Your email" />
                    <button className="btn">Subscribe</button>
                </div>
            </section>

            {/* 12. Contact CTA */}
            <section className="section">
                <h2>Contact Us</h2>
                <p className="muted">Questions about products, orders, or inventory? Reach out and we'll help.</p>
                <Link to="/contact"><button className="btn">Get in touch</button></Link>
            </section>
        </div>
    )
}
