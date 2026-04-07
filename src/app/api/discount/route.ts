import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code } = body;

        // Backend validation: Simulate checking a database for valid codes
        const validCodes: Record<string, number> = {
            'WELCOME10': 0.10, // 10% off
            'OLIVER20': 0.20,  // 20% off
            'LUXURY50': 0.50   // 50% off
        };

        const discountCode = typeof code === 'string' ? code.toUpperCase().trim() : '';

        if (validCodes[discountCode]) {
            return NextResponse.json(
                { valid: true, discountRate: validCodes[discountCode], message: `تم تطبيق كود خصم ${validCodes[discountCode] * 100}% بنجاح!` },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { valid: false, discountRate: 0, message: 'كود الخصم غير صحيح أو منتهي الصلاحية.' },
                { status: 400 } // Or 200 with valid: false, depending on API design preference. Using 400 for bad request.
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
