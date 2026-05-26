import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV partagé — CVForge',
  description: 'Aperçu lecture seule d’un CV partagé via CVForge.',
  robots: { index: false, follow: false },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
