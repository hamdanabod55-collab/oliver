"use client";

import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!');
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '140px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
                    
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-milk)', fontFamily: 'var(--font-cairo)', marginBottom: '16px', textAlign: 'center' }}>
                        اتصل <span className="text-brown">بنا</span>
                    </h1>
                    
                    <p style={{ color: 'var(--color-milk)', fontSize: '1.125rem', textAlign: 'center', marginBottom: '40px' }}>
                        نحن هنا لمساعدتك والإجابة على استفساراتك.
                    </p>

                    <div className="glass-card" style={{ padding: '40px 32px', borderRadius: '24px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>الاسم</label>
                                <input required type="text" className="contact-input" style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', outline: 'none', transition: 'all 0.3s' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>البريد الإلكتروني</label>
                                <input required type="email" className="contact-input" style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', outline: 'none', transition: 'all 0.3s' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-milk)', fontSize: '0.875rem', fontWeight: 600 }}>الرسالة</label>
                                <textarea required rows={5} className="contact-input" style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', outline: 'none', transition: 'all 0.3s', resize: 'vertical' }} />
                            </div>

                            <button type="submit" className="submit-btn" style={{ width: '100%', background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s', marginTop: '16px' }}>
                                إرسال الرسالة
                            </button>

                            {status && <div style={{ color: '#4CAF50', textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', fontWeight: 600 }}>{status}</div>}

                        </form>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-milk)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span dir="ltr">+967 782 828 113</span>
                        </div>
                        <a href="mailto:aaa777099691@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-milk)', textDecoration: 'none' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            <span>aaa777099691@gmail.com</span>
                        </a>
                    </div>

                </div>
            </main>
            <style>{`
                .contact-input:focus { border-color: var(--color-milk) !important; background: rgba(255,255,255,0.08) !important; }
                .submit-btn:hover { transform: scale(1.02); }
            `}</style>
        </>
    );
}
