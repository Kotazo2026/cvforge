import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CVForge — Éditeur CV v2',
  description:
    'Éditeur de CV en temps réel : 20 modèles, mise en page avancée, IA, vues Mobile/LinkedIn, partage et export PDF.',
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
