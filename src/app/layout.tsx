import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import React from "react";
import "./globals.css";
import SearchModal from '@/components/SearchModal';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const tajawal = Tajawal({ weight: ['400', '500', '700'], subsets: ["arabic"], variable: "--font-tajawal" });

export const metadata: Metadata = {
    title: "أوليفر ستور",
    description: "متجر إلكتروني عصري، بتصاميم راقية",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${cairo.variable} ${tajawal.variable}`} dir="rtl" style={{ background: 'var(--color-beige-dark)', color: 'var(--color-milk)', minHeight: '100vh', position: 'relative' }}>
        <SearchModal />
        <CartSidebar />
        <FloatingWhatsApp />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
        </div>
        <Footer />
      </body>
        </html>
    );
}
