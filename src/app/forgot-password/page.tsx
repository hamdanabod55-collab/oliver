"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/customer/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.error || 'حدث خطأ ما');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 60px' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '48px 32px', borderRadius: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 70%)', zIndex: 0 }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-milk)', marginBottom: '8px', fontFamily: 'var(--font-cairo)' }}>
                            استعادة كلمة المرور
                        </h1>
                        <p style={{ color: 'var(--color-milk)', marginBottom: '32px', fontSize: '0.9rem', opacity: 0.8 }}>
                            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين
                        </p>

                        {!message ? (
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                                <div style={{ textAlign: 'right' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="example@gmail.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none' }}
                                        className="auth-input"
                                    />
                                </div>

                                {error && <p style={{ color: '#FF5252', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ width: '100%', marginTop: '16px', background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(255,255,255,0.1)' }} 
                                    className="submit-btn"
                                >
                                    {loading ? 'جاري الإرسال...' : 'إرسال الرابط'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ background: 'rgba(76, 175, 80, 0.1)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                                <p style={{ color: '#4CAF50', margin: 0, lineHeight: 1.6 }}>{message}</p>
                                <Link href="/login" style={{ display: 'inline-block', marginTop: '24px', color: 'var(--color-milk)', fontWeight: 600, textDecoration: 'none' }}>العودة لتسجيل الدخول</Link>
                            </div>
                        )}

                        {!message && (
                            <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-milk)', opacity: 0.8 }}>
                                تذكرت كلمة المرور؟ <Link href="/login" className="hover-white" style={{ color: 'var(--color-milk)', fontWeight: 600, textDecoration: 'none' }}>تسجيل الدخول</Link>
                            </p>
                        )}
                    </div>
                </div>
            </main>
            <style>{`
                .auth-input:focus { border-color: var(--color-milk) !important; background: rgba(255,255,255,0.08) !important; }
                .submit-btn:hover:not(:disabled) { transform: scale(1.02); }
                .hover-white:hover { color: white !important; }
            `}</style>
        </>
    );
}
