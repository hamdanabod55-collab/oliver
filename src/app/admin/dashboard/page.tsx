"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, sales: 0 });
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch('/api/admin/products'),
                    fetch('/api/admin/orders')
                ]);
                
                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();

                if (Array.isArray(productsData) && Array.isArray(ordersData)) {
                    const totalSales = ordersData.reduce((acc, order) => acc + (order.total_price || 0), 0);
                    setStats({
                        products: productsData.length,
                        orders: ordersData.length,
                        sales: totalSales
                    });
                    setOrders(ordersData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const BentoCard = ({ title, value, label, icon, size = "small" }: any) => (
        <div className="glass-card" style={{ 
            padding: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            gridColumn: size === "large" ? "span 2" : "span 1",
            gridRow: size === "large" ? "span 1" : "span 1",
            minHeight: '200px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                    {icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>{label}</span>
            </div>
            <div>
                <h3 style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', fontWeight: 500 }}>{title}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-milk)' }}>
                    {loading ? '...' : value}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '140px', paddingBottom: '100px', minHeight: '100vh' }}>
                <div className="container">
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-milk)', marginBottom: '8px' }}>لوحة <span className="text-brown" style={{ color: '#332C27' }}>التحكم</span></h1>
                            <p style={{ color: 'rgba(255,255,255,0.7)' }}>أهلاً بك مجدداً، إليك ملخص المتجر اليوم.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link href="/admin/dashboard/products" style={{ background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>إدارة المنتجات</Link>
                            <button style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-milk)', padding: '12px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>الطلبات</button>
                        </div>
                    </header>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: '24px',
                        marginBottom: '24px'
                    }}>
                        <BentoCard 
                            title="إجمالي المنتجات" 
                            value={stats.products} 
                            label="مخزون" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>}
                        />
                        <BentoCard 
                            title="طلبات جديدة" 
                            value={stats.orders} 
                            label="إجمالي" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
                        />
                        <BentoCard 
                            title="إجمالي المبيعات" 
                            value={`$${stats.sales}`} 
                            label="تراكمي" 
                            size="large"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
                        />
                    </div>

                    <div className="glass-card" style={{ padding: '32px', marginTop: '24px' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-milk)', marginBottom: '24px' }}>آخر الطلبات</h2>
                        {orders.length === 0 ? (
                            <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '48px 0', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                لا توجد طلبات لعرضها حالياً
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{order.customer_phone}</div>
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--color-milk)' }}>${order.total_price}</div>
                                            <div style={{ fontSize: '0.8rem', color: order.status === 'PENDING' ? '#FFA500' : '#4CAF50' }}>{order.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
