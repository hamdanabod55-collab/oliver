import Link from 'next/link';

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  category: string;
  image?: string;
  delay?: number;
}

export default function ProductCard({ id, title, price, category, image, delay = 0 }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
      <div className="glass-card product-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', cursor: 'pointer', animationDelay: `${delay}ms` }}>
      <div className="img-container" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', aspectRatio: '1/1', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {image ? (
          <>
            <img src={image} alt="" style={{ position: 'absolute', inset: '-10%', width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(20px) brightness(0.5)', zIndex: 0 }} />
            <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-milk)', fontSize: '0.875rem' }}>
            {category} Image
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-main)', fontWeight: 600, marginBottom: '6px' }}>
          {category}
        </p>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 600, color: 'var(--color-milk)' }}>{title}</h3>
        <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-milk)' }}>{price.replace('$', '')} YR</p>
      </div>
      <style>{`
        .product-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(175, 148, 119, 0.1);
        }
        .img-container {
          transition: transform 0.4s ease;
        }
        .product-card:hover .img-container {
          transform: scale(1.05);
        }
      `}</style>
      </div>
    </Link>
  );
}
