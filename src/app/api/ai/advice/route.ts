import { NextResponse } from 'next/server';
import { generateAdvice } from '@/lib/ai/advice-service';
import { adviceRequestSchema } from '@/schemas/ai.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adviceRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const result = await generateAdvice(parsed.data.document);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
