import Link from 'next/link';
import Image from 'next/image';

const ArrowIcon = () => (
    <svg style={{ transform: 'scaleX(-1)' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" x2="17" y1="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
    </svg>
);

export default function BentoGrid() {
    return (
        <section className="container" id="categories" style={{ padding: '60px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}>تسوق حسب <span className="text-brown">الفئة</span></h2>
            </div>

            <div className="bento-grid">
                {/* Main large item - Electronics */}
                <Link href="/electronics" className="bento-item glass-card category-link" style={{ gridColumn: 'span 2', gridRow: 'span 2', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    <Image src="/images/categories/electronics.png" alt="إلكترونيات" fill style={{ objectFit: 'cover', zIndex: 0 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(51,44,39,0.95) 0%, rgba(51,44,39,0) 100%)', zIndex: 1 }} />
                    <div className="arrow-btn" style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-milk)', borderRadius: '50%', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'transform 0.3s ease, background 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <ArrowIcon />
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px', fontWeight: 700, color: 'var(--color-milk)' }}>إلكترونيات</h3>
                        <p style={{ color: 'var(--color-milk)', fontSize: '1.25rem', fontWeight: 500 }}>حواسيب وصوتيات الجيل القادم</p>
                    </div>
                </Link>

                {/* Top right item - Accessories */}
                <Link href="/accessories" className="bento-item glass-card category-link" style={{ gridColumn: 'span 2', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '300px', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    <Image src="/images/categories/accessories.png" alt="إكسسوارات" fill style={{ objectFit: 'cover', zIndex: 0 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(51,44,39,0.95) 0%, rgba(51,44,39,0) 100%)', zIndex: 1 }} />
                    <div className="arrow-btn" style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-milk)', borderRadius: '50%', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'transform 0.3s ease, background 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <ArrowIcon />
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '8px', fontWeight: 700, color: 'var(--color-milk)' }}>إكسسوارات</h3>
                        <p className="text-muted">إضافات أساسية لأجهزتك</p>
                    </div>
                </Link>

                {/* Bottom right item - Others */}
                <Link href="/other" className="bento-item glass-card category-link" style={{ gridColumn: 'span 2', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '300px', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    <Image src="/images/categories/others.png" alt="أخرى" fill style={{ objectFit: 'cover', zIndex: 0 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(51,44,39,0.95) 0%, rgba(51,44,39,0) 100%)', zIndex: 1 }} />
                    <div className="arrow-btn" style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-milk)', borderRadius: '50%', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'transform 0.3s ease, background 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <ArrowIcon />
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '8px', fontWeight: 700, color: 'var(--color-milk)' }}>أخرى</h3>
                        <p className="text-muted">منازل ذكية وأسلوب حياة</p>
                    </div>
                </Link>
            </div>
            <style>{`
        .bento-grid {
          @media (max-width: 768px) {
            display: flex;
            flex-direction: column;
          }
        }
        .category-link:hover .arrow-btn {
          transform: translate(-4px, -4px) scale(1.1);
          background: var(--color-milk) !important;
          color: var(--color-text-main) !important;
        }
      `}</style>
        </section>
    );
}
