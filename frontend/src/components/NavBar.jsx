import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <header className="nav">
            <nav>
                <Link to="/">NexGadget</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/services">Services</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/cart" style={{ float: 'right' }}>Cart</Link>
            </nav>
        </header>
    )
}
