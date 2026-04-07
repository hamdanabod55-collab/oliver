import Link from 'next/link';

export default function Hero() {
    return (
        <section style={{
            background: 'linear-gradient(135deg, var(--color-milk) 0%, var(--color-beige) 100%)',
            paddingTop: 'clamp(100px, 15vw, 160px)',
            paddingBottom: 'clamp(40px, 10vw, 80px)',
            textAlign: 'center',
            position: 'relative',
            borderBottomLeftRadius: '48px',
            borderBottomRightRadius: '48px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            marginBottom: '40px'
        }}>
            <div className="container">
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
                    ارتقِ بأسلوب حياتك <br />
                    <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--color-text-main)', opacity: 1 }}>الرقمي</span>
                </h1>
                <p style={{ maxWidth: '600px', margin: '0 auto 40px', color: 'var(--color-text-main)', fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 500 }}>
                    استكشف مجموعة مختارة بعناية من أحدث الإلكترونيات والإكسسوارات الفاخرة المصممة خصيصاً لتناسب العصر الحديث.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/electronics" style={{ textDecoration: 'none' }}>
                        <button style={{ background: 'var(--color-text-main)', color: 'var(--color-milk)', padding: '16px 36px', borderRadius: '99px', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s, background 0.3s', boxShadow: '0 8px 24px rgba(51,44,39,0.2)' }}>
                            تسوق المجموعة
                        </button>
                    </Link>
                    <button className="glass-card" style={{ padding: '16px 36px', borderRadius: '99px', border: '1px solid rgba(175,148,119,0.1)', background: 'var(--color-milk)', color: 'var(--color-text-main)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: 'none' }}>
                        استكشف الميزات
                    </button>
                </div>
            </div>
        </section>
    );
}
