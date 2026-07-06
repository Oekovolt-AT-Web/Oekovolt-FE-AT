import { NextResponse } from 'next/server';

export function middleware(request) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/files/')) {
        return new NextResponse('Gone', { status: 410 });
    }
    if (pathname.startsWith('/wp-content/')) {
        return new NextResponse('Gone', { status: 410 });
    }
    if (pathname.startsWith('/index.php/')) {
        return new NextResponse('Gone', { status: 410 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/files/:path*', '/wp-content/:path*', '/index.php/:path*']
};