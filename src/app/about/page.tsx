import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '140px', paddingBottom: '100px' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-milk)', fontFamily: 'var(--font-cairo)', marginBottom: '24px', lineHeight: 1.2 }}>
                        عن <span className="text-brown">أوليفر</span> ستور
                    </h1>
                    
                    <p style={{ color: 'var(--color-milk)', fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '64px' }}>
                        نحن لسنا مجرد متجر، نحن وجهة للباحثين عن التميز. في أوليفر ستور، ننتقي بعناية فائقة أحدث التقنيات وأرقى الإكسسوارات لنقدم لك تجربة تسوق استثنائية تعكس ذوقك الرفيع.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', textAlign: 'right' }}>
                        
                        <div className="glass-card" style={{ padding: '40px 32px', borderRadius: '24px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--color-milk)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                            </div>
                            <h3 style={{ color: 'var(--color-milk)', fontSize: '1.5rem', marginBottom: '16px' }}>رؤيتنا</h3>
                            <p style={{ color: 'var(--color-milk)', lineHeight: 1.7 }}>
                                أن نكون المعيار الأول للفخامة والجودة في عالم التجارة الإلكترونية، مقدمين منتجات تتجاوز التوقعات.
                            </p>
                        </div>

                        <div className="glass-card" style={{ padding: '40px 32px', borderRadius: '24px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--color-milk)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            </div>
                            <h3 style={{ color: 'var(--color-milk)', fontSize: '1.5rem', marginBottom: '16px' }}>ضمان الجودة</h3>
                            <p style={{ color: 'var(--color-milk)', lineHeight: 1.7 }}>
                                جميع منتجاتنا أصلية 100% وتخضع لمعايير فحص صارمة لضمان حصولك على الأفضل دائماً.
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}
