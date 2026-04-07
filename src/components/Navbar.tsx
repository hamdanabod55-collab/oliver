"use client";

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';

// Simple SVG Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function Navbar() {
    const { setSearchModalOpen, setCartOpen, cart } = useStore();
    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '16px 0', background: 'rgba(175, 148, 119, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-cairo)', color: 'var(--color-milk)', textDecoration: 'none' }}>
                    أوليفر <span className="text-brown" style={{ fontWeight: 400 }}>ستور</span>
                </Link>
                
                {/* Desktop Links */}
                <div className="nav-links desktop-only" style={{ display: 'none', gap: '2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>الرئيسية</Link>
                    <Link href="/electronics" style={{ color: 'inherit', textDecoration: 'none' }}>إلكترونيات</Link>
                    <Link href="/accessories" style={{ color: 'inherit', textDecoration: 'none' }}>إكسسوارات</Link>
                    <Link href="/other" style={{ color: 'inherit', textDecoration: 'none' }}>أخرى</Link>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', color: 'var(--color-milk)' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => setSearchModalOpen(true)}><SearchIcon /></span>
                    <Link href="/login" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'inherit' }}>
                        <UserIcon />
                        <span className="desktop-only" style={{ display: 'none', fontSize: '0.9rem', fontWeight: 600 }}>تسجيل الدخول</span>
                    </Link>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setCartOpen(true)}>
                        <CartIcon />
                        {mounted && cartItemsCount > 0 && (
                            <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--color-milk)', color: 'var(--color-text-main)', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold' }}>{cartItemsCount}</span>
                        )}
                    </div>
                    <span className="mobile-only" style={{ marginInlineStart: '0.5rem', cursor: 'pointer', display: 'block' }} onClick={() => setIsMenuOpen(true)}><MenuIcon /></span>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(51, 44, 39, 0.98)', zIndex: 200, display: 'flex', flexDirection: 'column', padding: '40px 24px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                        <button onClick={() => setIsMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-cairo)' }}>
                        <Link href="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--color-milk)', textDecoration: 'none' }}>الرئيسية</Link>
                        <Link href="/electronics" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--color-milk)', textDecoration: 'none' }}>إلكترونيات</Link>
                        <Link href="/accessories" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--color-milk)', textDecoration: 'none' }}>إكسسوارات</Link>
                        <Link href="/other" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--color-milk)', textDecoration: 'none' }}>أخرى</Link>
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', width: '40px', margin: '20px auto' }} />
                        <Link href="/login" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--color-beige)', textDecoration: 'none', fontSize: '1.1rem' }}>تسجيل الدخول</Link>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @media (min-width: 768px) {
                    .desktop-only { display: flex !important; }
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </nav>
    );
}
