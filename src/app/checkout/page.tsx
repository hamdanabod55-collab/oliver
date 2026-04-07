"use client";

import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const checkoutSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
    phone: z.string().regex(/^\+?\d{9,15}$/, 'رقم الجوال غير صحيح'),
    city: z.string().min(2, 'المدينة مطلوبة').max(100),
    address: z.string().min(5, 'العنوان التفصيلي مطلوب').max(200)
});

export default function CheckoutPage() {
    const { cart, clearCart } = useStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const subtotal = cart.reduce((total, item) => {
        const priceValue = typeof item.price === 'string' 
            ? parseFloat(item.price.replace('$', '').replace('YR', '').trim()) 
            : item.price;
        return (priceValue * item.quantity) + total;
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        setErrors({});
        
        if (cart.length === 0) {
            alert('السلة فارغة!');
            return;
        }

        const result = checkoutSchema.safeParse(formData);
        
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                if (issue.path[0]) {
                    formattedErrors[issue.path[0] as string] = issue.message;
                }
            });
            setErrors(formattedErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, cart })
            });

            const result = await response.json();

            if (!response.ok) {
                setApiError(result.error || 'حدث خطأ غير متوقع');
            } else if (result.success && result.url) {
                window.open(result.url, '_blank');
                clearCart();
                router.push('/');
            }
        } catch (error) {
            setApiError('تعذر الاتصال بالخادم. حاول مجدداً.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 60px' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', borderRadius: '32px', padding: '40px' }}>
                    
                    {/* Form Section */}
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-milk)', marginBottom: '8px', fontFamily: 'var(--font-cairo)' }}>إتمام الطلب</h1>
                        <p style={{ color: 'var(--color-milk)', marginBottom: '32px', fontSize: '0.9rem' }}>يرجى إدخال بياناتك لإرسال الطلب عبر واتساب</p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${errors.name ? '#FF5252' : 'rgba(255,255,255,0.1)'}`, color: 'var(--color-milk)', outline: 'none' }}
                                    className="checkout-input"
                                />
                                {errors.name && <span style={{ color: '#FF5252', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>رقم الجوال</label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${errors.phone ? '#FF5252' : 'rgba(255,255,255,0.1)'}`, color: 'var(--color-milk)', outline: 'none', textAlign: 'left' }}
                                        className="checkout-input"
                                        dir="ltr"
                                        placeholder="+966..."
                                    />
                                    {errors.phone && <span style={{ color: '#FF5252', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>المدينة</label>
                                    <input 
                                        type="text" 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${errors.city ? '#FF5252' : 'rgba(255,255,255,0.1)'}`, color: 'var(--color-milk)', outline: 'none' }}
                                        className="checkout-input"
                                    />
                                    {errors.city && <span style={{ color: '#FF5252', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.city}</span>}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>العنوان بالتفصيل</label>
                                <textarea 
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${errors.address ? '#FF5252' : 'rgba(255,255,255,0.1)'}`, color: 'var(--color-milk)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                    className="checkout-input"
                                />
                                {errors.address && <span style={{ color: '#FF5252', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
                            </div>

                            {apiError && (
                                <div style={{ background: 'rgba(255, 82, 82, 0.1)', color: '#FF5252', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 82, 82, 0.3)', marginBottom: '16px', textAlign: 'center' }}>
                                    {apiError}
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '16px', background: isLoading ? 'rgba(37, 211, 102, 0.5)' : '#25D366', color: '#FFF', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)' }} className="whatsapp-submit-btn">
                                {isLoading ? 'جاري الإرسال...' : 'إرسال الطلب عبر واتساب'}
                                {!isLoading && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Section */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-milk)', marginBottom: '24px', fontWeight: 600 }}>ملخص الطلب</h2>
                        
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', paddingRight: '8px' }} className="custom-scrollbar">
                            {cart.length === 0 ? (
                                <p style={{ color: 'var(--color-milk)', textAlign: 'center' }}>السلة فارغة</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: 'var(--color-milk)', fontSize: '0.9rem' }}>{item.title}</h4>
                                            <span style={{ color: 'var(--color-milk)', fontSize: '0.8rem' }}>الكمية: {item.quantity}</span>
                                        </div>
                                        <span style={{ color: 'var(--color-milk)', fontWeight: 600 }}>{item.price}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-milk)' }}>
                                <span>الإجمالي:</span>
                                <span>{subtotal.toFixed(0)} YR</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <style>{`
                .checkout-input:focus {
                    background: rgba(255,255,255,0.08) !important;
                }
                .whatsapp-submit-btn:hover {
                    transform: scale(1.02);
                    background: #20BD5A !important;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
                
                @media (max-width: 768px) {
                    .glass-card { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}
