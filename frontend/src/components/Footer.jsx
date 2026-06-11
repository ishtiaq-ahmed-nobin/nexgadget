import React from 'react'

export default function Footer() {
    return (
        <footer className="footer">
            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                    <h3>NexGadget</h3>
                    <div className="muted">Modern gadget e-commerce & inventory management</div>
                </div>
                <div>
                    <div>© {new Date().getFullYear()} NexGadget</div>
                    <div>Privacy · Terms</div>
                </div>
            </div>
        </footer>
    )
}
