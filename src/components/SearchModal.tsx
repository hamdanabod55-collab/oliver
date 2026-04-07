"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const searchSchema = z.string().max(100);

export default function SearchModal() {
    const { isSearchModalOpen, setSearchModalOpen } = useStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    // Mock generic products for search
    const allProducts = [
        { id: 1, title: 'سماعات أذن لاسلكية فاخرة', category: 'إلكترونيات', link: '/product/1' },
        { id: 2, title: 'شاحن حائط سريع 65W', category: 'إلكترونيات', link: '/product/2' },
        { id: 3, title: 'بنك طاقة مغناطيسي رفيع', category: 'إلكترونيات', link: '/product/3' },
        { id: 101, title: 'ساعة كرونوغراف كلاسيكية', category: 'ساعات رجالية', link: '/product/101' },
        { id: 201, title: 'ساعة نسائية مرصعة بالألماس الأبيض', category: 'ساعات نسائية', link: '/product/201' },
    ];

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        // Validate max length using Zod
        const result = searchSchema.safeParse(query);
        if (!result.success) {
            setResults([]);
            return;
        }

        // Advanced XSS Protection using DOMPurify
        const sanitizedQuery = DOMPurify.sanitize(query, { ALLOWED_TAGS: [] }).toLowerCase();

        const filtered = allProducts.filter(p => 
            p.title.toLowerCase().includes(sanitizedQuery) || 
            p.category.toLowerCase().includes(sanitizedQuery)
        );
        setResults(filtered);
    }, [query]);

    if (!isSearchModalOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', padding: '0 24px' }}>
            {/* Backdrop */}
            <div 
                style={{ position: 'absolute', inset: 0, background: 'rgba(51, 44, 39, 0.8)', backdropFilter: 'blur(8px)' }} 
                onClick={() => setSearchModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="glass-card" style={{ position: 'relative', width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '24px', animation: 'slideDown 0.3s ease-out' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-milk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', opacity: 1 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input 
                        type="text" 
                        placeholder="ابحث عن المنتجات، العلامات التجارية..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-milk)', fontSize: '1.25rem', outline: 'none' }}
                        className="search-input"
                    />
                    <button onClick={() => setSearchModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--color-milk)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                    </button>
                </div>

                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {query.trim() === '' ? (
                        <p style={{ color: 'var(--color-milk)', textAlign: 'center', padding: '32px 0' }}>اكتب ما تبحث عنه للبدء...</p>
                    ) : results.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {results.map(product => (
                                <li key={product.id}>
                                    <Link 
                                        href={product.link}
                                        onClick={() => setSearchModalOpen(false)}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                        className="search-result-item"
                                    >
                                        <span style={{ color: 'var(--color-milk)', fontWeight: 600, fontSize: '1rem' }}>{product.title}</span>
                                        <span style={{ color: 'var(--color-milk)', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '8px' }}>{product.category}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--color-milk)', textAlign: 'center', padding: '32px 0' }}>لا توجد نتائج مطابقة لبحثك.</p>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .search-input::placeholder {
                    color: var(--color-milk);
                }
                .search-result-item:hover {
                    background: rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </div>
    );
}
