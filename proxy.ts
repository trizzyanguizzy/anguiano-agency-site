import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, isValidSession } from '@/lib/family/auth';

// Gates the family app (/family) and its APIs behind the household passcode. Cron routes live
// under /api/cron and check CRON_SECRET themselves; PWA files are in /family-assets and /sw-family.js.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/family/login') return NextResponse.next();

  if (await isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/family/login';
  url.search = pathname === '/family' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/family', '/family/:path*', '/api/meals/:path*', '/api/push/:path*'],
};
