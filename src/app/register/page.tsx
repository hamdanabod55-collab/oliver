"use client";

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/customer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('تم إنشاء الحساب بنجاح! جاري تحويلك...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.error || 'فشل التسجيل');
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
                <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '48px 32px', borderRadius: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 70%)', zIndex: 0 }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-milk)', marginBottom: '8px', fontFamily: 'var(--font-cairo)' }}>
                            إنشاء حساب جديد
                        </h1>
                        <p style={{ color: 'var(--color-milk)', marginBottom: '32px', fontSize: '0.9rem', opacity: 0.8 }}>
                            انضم إلى عالم الفخامة في أوليفر ستور
                        </p>

                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                            
                            <div style={{ textAlign: 'right' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>الاسم بالكامل</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="أوليفر" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none', transition: 'border 0.3s' }}
                                    className="auth-input"
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>البريد الإلكتروني</label>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="example@gmail.com" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none' }}
                                    className="auth-input"
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>كلمة المرور</label>
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none' }}
                                    className="auth-input"
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>تأكيد كلمة المرور</label>
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••" 
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', fontSize: '1rem', outline: 'none' }}
                                    className="auth-input"
                                />
                            </div>

                            {error && <p style={{ color: '#FF5252', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                            {success && <p style={{ color: '#4CAF50', fontSize: '0.875rem', margin: 0 }}>{success}</p>}

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ width: '100%', marginTop: '16px', background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(255,255,255,0.1)' }} 
                                className="submit-btn"
                            >
                                {loading ? 'جاري التحميل...' : 'إنشاء الحساب'}
                            </button>
                        </form>

                        <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-milk)', opacity: 0.8 }}>
                            لديك حساب بالفعل؟ <Link href="/login" className="hover-white" style={{ color: 'var(--color-milk)', fontWeight: 600, textDecoration: 'none' }}>تسجيل الدخول</Link>
                        </p>
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
