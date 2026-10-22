import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, isValidSession } from '@/lib/meals/auth';

// Gates the household meal planner. Cron routes live under /api/cron and check
// CRON_SECRET themselves; static PWA assets live in /meals-assets and /sw-meals.js.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/meals/login') return NextResponse.next();

  const ok = await isValidSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (ok) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/meals/login';
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/meals', '/meals/:path*', '/api/meals/:path*'],
};
