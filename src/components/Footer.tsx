import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--color-beige-dark)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '64px', paddingBottom: '32px', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
                
                {/* Brand */}
                <div>
                    <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-cairo)', color: 'var(--color-milk)', textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
                        أوليفر <span className="text-brown" style={{ fontWeight: 400 }}>ستور</span>
                    </Link>
                    <p style={{ color: 'var(--color-milk)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        وجهتك الأولى للفخامة والأناقة في عالم الإلكترونيات والإكسسوارات.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: 'var(--color-milk)', fontSize: '1.125rem', marginBottom: '16px', fontWeight: 600 }}>روابط سريعة</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link href="/electronics" className="footer-link">إلكترونيات</Link></li>
                        <li><Link href="/accessories" className="footer-link">إكسسوارات</Link></li>
                        <li><Link href="#others" className="footer-link">أخرى</Link></li>
                        <li style={{ marginTop: '8px' }}>
                            <a href="mailto:aaa777099691@gmail.com" style={{ color: 'var(--color-milk)', textDecoration: 'none', fontSize: '0.85rem', opacity: 0.8 }} className="hover-white">aaa777099691@gmail.com</a>
                        </li>
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h4 style={{ color: 'var(--color-milk)', fontSize: '1.125rem', marginBottom: '16px', fontWeight: 600 }}>المساعدة</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link href="/orders" className="footer-link">تتبع الطلب</Link></li>
                        <li><Link href="/about" className="footer-link">من نحن</Link></li>
                        <li><Link href="/contact" className="footer-link">اتصل بنا</Link></li>
                    </ul>
                </div>

                {/* Socials & Newsletter */}
                <div>
                    <h4 style={{ color: 'var(--color-milk)', fontSize: '1.125rem', marginBottom: '16px', fontWeight: 600 }}>اشترك بالنشرة البريدية</h4>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <input type="email" placeholder="البريد الإلكتروني" style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-milk)', outline: 'none' }} className="newsletter-input" />
                        <button style={{ background: 'var(--color-milk)', color: 'var(--color-text-main)', border: 'none', borderRadius: '12px', padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}>اشترك</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <p style={{ margin: 0, color: 'var(--color-milk)', fontSize: '0.875rem' }}>
                    © 2026 أوليفر ستور. جميع الحقوق محفوظة.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <a href="https://www.instagram.com/1._oliver?igsh=MXNwZHd2Y2RzYmhtOQ==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-milk)', transition: 'color 0.2s' }} className="hover-white">انستجرام</a>
                    <a href="#" style={{ color: 'var(--color-milk)', transition: 'color 0.2s' }} className="hover-white">تويتر</a>
                    <a href="#" style={{ color: 'var(--color-milk)', transition: 'color 0.2s' }} className="hover-white">فيسبوك</a>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: var(--color-milk);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: color 0.2s, transform 0.2s;
                    display: inline-block;
                }
                .footer-link:hover {
                    color: var(--color-milk);
                    transform: translateX(-4px);
                }
                .newsletter-input:focus {
                    border-color: var(--color-milk) !important;
                    background: rgba(255,255,255,0.08) !important;
                }
                .hover-white:hover { color: var(--color-milk) !important; }
            `}</style>
        </footer>
    );
}
