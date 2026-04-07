"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/');
                router.refresh(); // Refresh to update navbar/auth state if any
            } else {
                setError(data.error || 'فشل تسجيل الدخول');
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
                            مرحباً بك مجدداً
                        </h1>
                        <p style={{ color: 'var(--color-milk)', marginBottom: '32px', fontSize: '0.9rem' }}>
                            سجل دخولك لاكتشاف الفخامة
                        </p>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                            
                            <div style={{ textAlign: 'right' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>البريد الإلكتروني</label>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="example@gmail.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none', transition: 'border 0.3s, background 0.3s' }}
                                    className="auth-input"
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                    <label style={{ color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>كلمة المرور</label>
                                    <Link href="/forgot-password" style={{ color: 'var(--color-milk)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-white">نسيت كلمة المرور؟</Link>
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none', transition: 'border 0.3s, background 0.3s' }}
                                    className="auth-input"
                                />
                            </div>

                            {error && <p style={{ color: '#FF5252', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

                            <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '16px', background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, background 0.2s', boxShadow: '0 8px 24px rgba(255,255,255,0.1)' }} className="submit-btn">
                                {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                            </button>
                        </form>

                        <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-milk)' }}>
                            ليس لديك حساب؟ <Link href="/register" className="hover-white" style={{ color: 'var(--color-milk)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>قم بإنشاء حساب</Link>
                        </p>
                    </div>
                </div>
            </main>
            <style>{`
                .auth-input:focus {
                    border-color: var(--color-milk) !important;
                    background: rgba(255,255,255,0.08) !important;
                }
                .submit-btn:hover {
                    transform: scale(1.02);
                    background: #FDFBF7 !important;
                }
                .hover-white:hover { color: var(--color-milk) !important; }
            `}</style>
        </>
    );
}
