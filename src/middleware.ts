import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Pass through if the user is visiting auth routes or public static assets
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Session verification hook ready for active Supabase instance
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
