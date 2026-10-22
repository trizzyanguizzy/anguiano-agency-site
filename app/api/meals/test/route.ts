import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendToEndpoint } from '@/lib/meals/push';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({ endpoint: z.string().url() });

/** Sends a test notification to the calling device only. */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  try {
    const result = await sendToEndpoint(parsed.data.endpoint, {
      title: 'Reminders are working ✅',
      body: 'You’ll get lunch at ~10, dinner at ~3, and freezer reminders at ~8.',
      tag: 'test',
      url: '/meals',
    });
    if (result === 'not-found') return NextResponse.json({ error: 'This device isn’t registered yet.' }, { status: 404 });
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
