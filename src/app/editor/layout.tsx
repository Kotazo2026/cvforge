import type { Metadata } from 'next';
import { CvPersistBootstrap } from './CvPersistBootstrap';

export const metadata: Metadata = {
  title: 'CVForge — Créez votre CV',
  description:
    'Créez et personnalisez votre CV en temps réel avec 8 modèles premium et export PDF.',
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CvPersistBootstrap />
      {children}
    </>
  );
}
