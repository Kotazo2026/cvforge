import { NextResponse } from 'next/server';
import { generateGrammarCheck } from '@/lib/ai/grammar-service';
import { grammarRequestSchema } from '@/schemas/ai.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = grammarRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const result = await generateGrammarCheck(parsed.data.document);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
