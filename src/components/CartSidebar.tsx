"use client";

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function CartSidebar() {
    const { isCartOpen, setCartOpen, cart, removeFromCart, updateQuantity } = useStore();
    const [discountCode, setDiscountCode] = useState('');
    const [discountRate, setDiscountRate] = useState(0);
    const [discountMessage, setDiscountMessage] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const subtotal = cart.reduce((total, item) => {
        const priceValue = typeof item.price === 'string' 
            ? parseFloat(item.price.replace('$', '').replace('YR', '').trim()) 
            : item.price;
        return total + priceValue * item.quantity;
    }, 0);

    const discountAmount = subtotal * discountRate;
    const total = subtotal - discountAmount;

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) return;
        setIsValidating(true);
        setDiscountMessage('');
        
        try {
            const res = await fetch('/api/discount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: discountCode }),
            });
            const data = await res.json();
            
            if (res.ok && data.valid) {
                setDiscountRate(data.discountRate);
                setDiscountMessage(data.message);
            } else {
                setDiscountRate(0);
                setDiscountMessage(data.message || 'كود غير صالح');
            }
        } catch (error) {
            setDiscountMessage('حدث خطأ أثناء التحقق.');
        } finally {
            setIsValidating(false);
        }
    };

    if (!mounted) return null;
    if (!isCartOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div 
                style={{ position: 'absolute', inset: 0, background: 'rgba(51, 44, 39, 0.4)', backdropFilter: 'blur(4px)' }} 
                onClick={() => setCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="glass" style={{ position: 'relative', width: '100%', maxWidth: '480px', height: '100%', background: 'rgba(51, 44, 39, 0.95)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', animation: 'slideRight 0.3s ease-out' }}>
                
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-milk)', fontFamily: 'var(--font-cairo)' }}>سلة المشتريات</h2>
                    <button onClick={() => setCartOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-milk)', cursor: 'pointer', padding: '8px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-milk)', marginTop: '40px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 1 }}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            <p style={{ fontSize: '1.25rem' }}>السلة فارغة</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-milk)' }}>صورة</span>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-milk)', lineHeight: 1.4 }}>{item.title}</h3>
                                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-milk)', cursor: 'pointer', padding: '4px' }} title="إزالة">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2px' }}>
                                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ background: 'transparent', border: 'none', color: 'var(--color-milk)', width: '28px', cursor: 'pointer' }}>-</button>
                                            <span style={{ width: '28px', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'transparent', border: 'none', color: 'var(--color-milk)', width: '28px', cursor: 'pointer' }}>+</button>
                                        </div>
                                        <span style={{ fontWeight: 600, color: 'var(--color-milk)' }}>{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cart.length > 0 && (
                    <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(51, 44, 39, 0.98)' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input 
                                type="text" 
                                placeholder="كود الخصم (مثال: WELCOME10)" 
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', outline: 'none' }}
                                className="styled-input"
                            />
                            <button onClick={handleApplyDiscount} disabled={isValidating} className="glass" style={{ padding: '0 16px', borderRadius: '12px', color: 'var(--color-milk)', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
                                {isValidating ? 'جاري...' : 'تطبيق'}
                            </button>
                        </div>
                        {discountMessage && (
                            <p style={{ fontSize: '0.875rem', marginBottom: '16px', color: discountRate > 0 ? '#4CAF50' : '#FF5252' }}>{discountMessage}</p>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-milk)' }}>
                            <span>المجموع الفرعي:</span>
                            <span>{subtotal.toFixed(0)} YR</span>
                        </div>
                        {discountRate > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#4CAF50' }}>
                                <span>الخصم ({(discountRate * 100).toFixed(0)}%):</span>
                                <span>-{discountAmount.toFixed(0)} YR</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-milk)' }}>
                            <span>الإجمالي:</span>
                            <span>{total.toFixed(0)} YR</span>
                        </div>
                        
                        <Link 
                            href="/checkout" 
                            onClick={() => setCartOpen(false)} 
                            style={{ 
                                width: '100%', 
                                background: 'var(--color-milk)', 
                                color: 'var(--color-text-main)', 
                                padding: '16px', 
                                borderRadius: '16px', 
                                textDecoration: 'none', 
                                fontSize: '1rem', 
                                fontWeight: 700, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px', 
                                transition: 'transform 0.2s', 
                                boxShadow: '0 8px 24px rgba(255,255,255,0.1)' 
                            }} 
                            className="checkout-btn"
                        >
                            متابعة الدفع عبر واتساب
                            <svg style={{ transform: 'scaleX(-1)' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideRight {
                    from { transform: translateX(-100%); } /* RTL context, slide from left */
                    to { transform: translateX(0); }
                }
                .styled-input:focus { border-color: var(--color-milk) !important; }
                .checkout-btn:hover { transform: scale(1.02); }
            `}</style>
        </div>
    );
}
