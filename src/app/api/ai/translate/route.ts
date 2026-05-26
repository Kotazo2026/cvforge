import { NextResponse } from 'next/server';
import { generateTranslation } from '@/lib/ai/translate-service';
import { translateRequestSchema } from '@/schemas/ai.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = translateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const result = await generateTranslation(parsed.data.document, parsed.data.targetLanguage);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
