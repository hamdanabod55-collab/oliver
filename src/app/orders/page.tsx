import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function OrdersPage() {
    // In a real application, check authentication token here. 
    // If not authenticated: redirect('/login');
    const isAuthenticated = true; // Simulating logged-in state

    if (!isAuthenticated) {
        redirect('/login');
    }

    const mockOrders = [
        { id: '#ORD-20260311', date: '2026-03-11', total: '299.00$', status: 'قيد التنفيذ', items: 2 },
        { id: '#ORD-20260228', date: '2026-02-28', total: '159.50$', status: 'مكتمل', items: 1 },
        { id: '#ORD-20251105', date: '2025-11-05', total: '850.00$', status: 'مكتمل', items: 3 },
    ];

    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', padding: '140px 24px 60px' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-milk)', fontFamily: 'var(--font-cairo)', margin: 0 }}>
                            <span className="text-brown">طلباتي</span>
                        </h1>
                        <Link href="/" style={{ color: 'var(--color-milk)', textDecoration: 'none', fontSize: '0.875rem' }} className="hover-white">العودة للتسوق</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {mockOrders.length === 0 ? (
                            <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center', borderRadius: '24px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 1, color: 'var(--color-milk)' }}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                <p style={{ color: 'var(--color-milk)', fontSize: '1.25rem', marginBottom: '24px' }}>لا توجد طلبات سابقة.</p>
                                <Link href="/electronics">
                                    <button className="action-btn" style={{ background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '12px 32px', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>تصفح المنتجات</button>
                                </Link>
                            </div>
                        ) : (
                            mockOrders.map(order => (
                                <div key={order.id} className="glass-card order-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s, background 0.2s' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <h3 style={{ margin: 0, color: 'var(--color-milk)', fontSize: '1.125rem', fontWeight: 600 }}>{order.id}</h3>
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                padding: '4px 12px', 
                                                borderRadius: '24px', 
                                                fontWeight: 600,
                                                background: order.status === 'مكتمل' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                color: order.status === 'مكتمل' ? '#4CAF50' : '#FFC107'
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--color-milk)', fontSize: '0.875rem' }}>
                                            التاريخ: {order.date} • {order.items} منتجات
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-milk)', marginBottom: '8px' }}>{order.total}</div>
                                        <button className="glass" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.875rem', color: 'var(--color-milk)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>التفاصيل</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <style>{`
                .hover-white:hover { color: var(--color-milk) !important; }
                .order-card:hover {
                    transform: translateY(-4px);
                    background: rgba(255,255,255,0.05) !important;
                }
                @media (max-width: 600px) {
                    .order-card {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 16px;
                    }
                    .order-card > div:last-child {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .order-card > div:last-child > div { margin-bottom: 0 !important; }
                }
            `}</style>
        </>
    );
}
