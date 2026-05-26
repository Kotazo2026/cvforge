import { NextResponse } from 'next/server';
import { generatePrefillProposal } from '@/lib/ai/prefill-service';
import { hasPrefillChanges } from '@/lib/ai/prefill-local';
import { prefillRequestSchema } from '@/schemas/ai.schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = prefillRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const proposal = await generatePrefillProposal(
      parsed.data.document,
      parsed.data.jobOffer,
    );

    if (!hasPrefillChanges(proposal)) {
      return NextResponse.json({
        proposal,
        message: 'Le CV est déjà bien aligné sur cette offre.',
      });
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
