"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'فشل تسجيل الدخول');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال بالخادم');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--color-beige-dark)',
            backgroundImage: 'var(--bg-mesh)',
            padding: '24px'
        }}>
            <div className="glass-card" style={{ 
                maxWidth: '400px', 
                width: '100%', 
                padding: '48px 32px',
                textAlign: 'center'
            }}>
                <Link href="/" style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    fontFamily: 'var(--font-cairo)', 
                    color: 'var(--color-milk)', 
                    textDecoration: 'none', 
                    display: 'block', 
                    marginBottom: '32px' 
                }}>
                    أوليفر <span className="text-brown" style={{ color: '#332C27' }}>لوحة التحكم</span>
                </Link>

                <h1 style={{ 
                    fontSize: '1.5rem', 
                    color: 'var(--color-milk)', 
                    marginBottom: '8px',
                    fontWeight: 600
                }}>تسجيل الدخول</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '0.9rem' }}>
                    يرجى إدخال بيانات المسؤول للمتابعة
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem' }}>اسم المستخدم</label>
                        <input 
                            required 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                borderRadius: '12px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                color: 'var(--color-milk)', 
                                outline: 'none' 
                            }} 
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem' }}>كلمة المرور</label>
                        <input 
                            required 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                borderRadius: '12px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                color: 'var(--color-milk)', 
                                outline: 'none' 
                            }} 
                        />
                    </div>

                    {error && <p style={{ color: '#FF6B6B', fontSize: '0.875rem', marginTop: '8px' }}>{error}</p>}

                    <button 
                        disabled={isLoading}
                        type="submit" 
                        style={{ 
                            width: '100%', 
                            background: 'var(--color-milk)', 
                            color: 'var(--color-text-main)', 
                            padding: '16px', 
                            borderRadius: '12px', 
                            border: 'none', 
                            fontSize: '1rem', 
                            fontWeight: 700, 
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            marginTop: '12px',
                            opacity: isLoading ? 0.7 : 1,
                            transition: 'transform 0.2s'
                        }}
                    >
                        {isLoading ? 'جاري التحقق...' : 'دخول'}
                    </button>
                </form>
            </div>
        </main>
    );
}
