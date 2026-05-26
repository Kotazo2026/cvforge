import { NextResponse } from 'next/server';
import { createShareRecord } from '@/lib/share/share-store.server';
import { buildShareUrl } from '@/lib/share/share.utils';
import { createShareRequestSchema } from '@/schemas/share.schema';

function requestOrigin(request: Request): string {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';
  if (host) return `${proto}://${host}`;
  return '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createShareRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const record = createShareRecord(parsed.data.document, parsed.data.ownerLabel);
    const origin = requestOrigin(request);

    return NextResponse.json({
      token: record.token,
      url: buildShareUrl(record.token, origin),
      title: record.title,
      expiresAt: record.expiresAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
