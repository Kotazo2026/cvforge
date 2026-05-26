import { NextResponse } from 'next/server';
import { getShareRecord } from '@/lib/share/share-store.server';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const decoded = decodeURIComponent(token);
    const record = getShareRecord(decoded);

    if (!record) {
      return NextResponse.json({ error: 'Lien expiré ou introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ record });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
