import { NextResponse } from 'next/server';
import { generateAtsScore } from '@/lib/ai/ats-score-service';
import { atsScoreRequestSchema } from '@/schemas/ai.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = atsScoreRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = await generateAtsScore(parsed.data.document, parsed.data.jobOffer);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
