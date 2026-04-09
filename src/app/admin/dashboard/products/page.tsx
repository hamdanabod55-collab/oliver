"use client";

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 1,
        stock: 1,
        category: 'electronics',
        subcategory: '',
        isFeatured: false,
        image_url: ''
    });
    
    // Toast state
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: null }), 4000);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. File Type Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showToast('صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة jpg، png، أو webp', 'error');
            // reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // 2. File Size Validation (Max 4MB)
        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
            showToast('حجم الصورة كبير جداً. الحد الأقصى هو 4 ميجابايت', 'error');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploading(true);
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                console.error("Missing Supabase environment variables.");
                showToast('إعدادات الخادم مفقودة للصور. يرجى مراجعة الدعم الفني.', 'error');
                setIsUploading(false);
                return;
            }

            const supabaseBrowser = createClient(supabaseUrl, supabaseKey);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

            const { data, error } = await supabaseBrowser.storage
                .from('products')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('[Supabase Upload Error]', error);
                showToast(error.message || 'فشل رفع الصورة', 'error');
                return;
            }

            const { data: publicUrlData } = supabaseBrowser.storage
                .from('products')
                .getPublicUrl(fileName);

            if (publicUrlData && publicUrlData.publicUrl) {
                setFormData({ ...formData, image_url: publicUrlData.publicUrl });
                showToast('تم رفع الصورة بنجاح', 'success');
            } else {
                showToast('فشل الحصول على رابط الصورة', 'error');
            }
        } catch (error) {
            console.error('[Upload Network Error]', error);
            showToast('حدث خطأ بالشبكة أثناء الرفع', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';

        try {
            // Validate numbers before sending
            const price = parseFloat(formData.price.toString());
            const stock = parseInt(formData.stock.toString());

            if (isNaN(price)) {
                showToast('الرجاء إدخال سعر صحيح', 'error');
                return;
            }

            const submissionData = {
                ...formData,
                price,
                stock: isNaN(stock) ? 0 : stock
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            const data = await res.json();
            
            if (res.ok) {
                showToast(editingProduct ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح', 'success');
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({ name: '', description: '', price: 1, stock: 1, category: 'electronics', subcategory: '', isFeatured: false, image_url: '' });
                fetchProducts();
            } else {
                // Formatting Zod errors or server message
                let errorMsg = 'فشل الحفظ';
                if (data.message) {
                    errorMsg = data.message;
                } else if (data.error && Array.isArray(data.error)) {
                    errorMsg = data.error.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(' | ');
                } else if (data.error) {
                    errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
                }
                showToast(errorMsg, 'error');
            }
        } catch (error) {
            showToast('حدث خطأ أثناء الاتصال بالسيرفر', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                showToast('تم حذف المنتج بنجاح', 'success');
                fetchProducts();
            } else {
                showToast(data.message || data.error || 'فشل حذف المنتج', 'error');
            }
        } catch (error) {
            showToast('حدث خطأ أثناء الاتصال بالسيرفر', 'error');
        }
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            subcategory: product.subcategory || '',
            isFeatured: product.isFeatured || false,
            image_url: product.image_url
        });
        setIsModalOpen(true);
    };

    return (
        <>
            <Navbar />
            
            {/* Toast Notification */}
            {toast.type && (
                <div style={{ 
                    position: 'fixed', 
                    top: '100px', 
                    right: '20px', 
                    zIndex: 2000, 
                    background: toast.type === 'success' ? '#2ecc71' : '#e74c3c',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    animation: 'slideIn 0.3s ease-out forwards',
                    fontWeight: 600,
                    fontFamily: 'var(--font-cairo)'
                }}>
                    {toast.message}
                </div>
            )}

            <main style={{ paddingTop: '140px', paddingBottom: '100px', minHeight: '100vh' }}>
                <div className="container">
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', color: 'var(--color-milk)' }}>إدارة <span className="text-brown" style={{ color: '#332C27' }}>المنتجات</span></h1>
                            <Link href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>← العودة للوحة التحكم</Link>
                        </div>
                        <button onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: 1, stock: 1, category: 'electronics', subcategory: '', isFeatured: false, image_url: '' }); setIsModalOpen(true); }} style={{ background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ إضافة منتج جديد</button>
                    </header>

                    <div className="glass-card" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '20px', color: 'rgba(255,255,255,0.5)' }}>المنتج</th>
                                    <th style={{ padding: '20px', color: 'rgba(255,255,255,0.5)' }}>الفئة</th>
                                    <th style={{ padding: '20px', color: 'rgba(255,255,255,0.5)' }}>السعر</th>
                                    <th style={{ padding: '20px', color: 'rgba(255,255,255,0.5)' }}>المميز</th>
                                    <th style={{ padding: '20px', color: 'rgba(255,255,255,0.5)' }}>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>لا توجد منتجات مضافة بعد.</td></tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                                        <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div>
                                                        <div>{product.name}</div>
                                                        {product.subcategory && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{product.subcategory}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px' }}>{product.category}</td>
                                            <td style={{ padding: '20px' }}>{product.price} YR</td>
                                            <td style={{ padding: '20px' }}>
                                                {product.isFeatured ? (
                                                    <span style={{ background: 'rgba(175, 148, 119, 0.2)', color: 'var(--color-beige)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>مميز ★</span>
                                                ) : (
                                                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>عادي</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button onClick={() => openEditModal(product)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-milk)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>تعديل</button>
                                                    <button onClick={() => handleDelete(product.id)} style={{ background: 'rgba(255,107,107,0.1)', border: 'none', color: '#FF6B6B', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>حذف</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Implementation */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ color: 'var(--color-milk)', marginBottom: '24px' }}>{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>اسم المنتج</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>الفئة</label>
                                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: e.target.value === 'accessories' ? formData.subcategory : ''})} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                                        <option value="electronics" style={{ background: '#332C27' }}>إلكترونيات</option>
                                        <option value="accessories" style={{ background: '#332C27' }}>إكسسوارات</option>
                                        <option value="other" style={{ background: '#332C27' }}>أخرى</option>
                                    </select>
                                </div>
                            </div>
                            
                            {formData.category === 'accessories' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>القسم الفرعي</label>
                                    <select required value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                                        <option value="" disabled style={{ background: '#332C27' }}>اختر القسم الفرعي</option>
                                        <option value="Men" style={{ background: '#332C27' }}>ساعات رجالية</option>
                                        <option value="Women" style={{ background: '#332C27' }}>ساعات نسائية</option>
                                    </select>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>السعر (YR)</label>
                                    <input 
                                        required 
                                        type="text" 
                                        inputMode="decimal"
                                        value={formData.price} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Allow empty string, numbers, and one decimal point
                                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                setFormData({...formData, price: val as any});
                                            }
                                        }} 
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>المخزون</label>
                                    <input 
                                        required 
                                        type="text" 
                                        inputMode="numeric"
                                        value={formData.stock} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || /^\d*$/.test(val)) {
                                                setFormData({...formData, stock: val as any});
                                            }
                                        }} 
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: '2px solid var(--color-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isFeatured ? 'var(--color-beige)' : 'transparent' }}>
                                    {formData.isFeatured && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                </div>
                                <span style={{ color: 'var(--color-milk)', fontSize: '0.9rem', fontWeight: 600 }}>إضافة للمنتجات المميزة (يظهر في الواجهة الرئيسية)</span>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>صورة المنتج</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        borderRadius: '12px', 
                                        background: 'rgba(255,255,255,0.05)', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {formData.image_url ? (
                                            <img src={formData.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                        )}
                                        {isUploading && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div className="loader"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            style={{ 
                                                width: '100%', 
                                                padding: '12px', 
                                                borderRadius: '8px', 
                                                background: 'rgba(255,255,255,0.1)', 
                                                border: '1px dashed rgba(255,255,255,0.3)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {isUploading ? 'جاري الرفع...' : 'اختر صورة من الجهاز'}
                                        </button>
                                        <input 
                                            type="text" 
                                            placeholder="أو ضع رابط مباشر" 
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                            style={{ 
                                                width: '100%', 
                                                marginTop: '8px',
                                                padding: '8px 12px', 
                                                borderRadius: '8px', 
                                                background: 'rgba(255,255,255,0.05)', 
                                                border: '1px solid rgba(255,255,255,0.1)', 
                                                color: 'white', 
                                                fontSize: '0.75rem',
                                                outline: 'none' 
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>الوصف</label>
                                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="submit" style={{ flex: 1, background: 'var(--color-milk)', color: 'var(--color-text-main)', padding: '14px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>حفظ</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--color-milk)', padding: '14px', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .loader {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #fff;
                    border-bottom-color: transparent;
                    border-radius: 50%;
                    display: inline-block;
                    animation: rotation 1s linear infinite;
                }
                @keyframes rotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                }
                @media (max-width: 600px) {
                    header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
                    .glass-card { padding: 20px !important; border-radius: 16px; }
                    table th, table td { padding: 12px 8px !important; font-size: 0.8rem; }
                    .container { padding: 0 16px; }
                }
            `}</style>
        </>
    );
}
