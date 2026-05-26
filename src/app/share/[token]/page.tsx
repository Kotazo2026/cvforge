import { ShareViewClient } from '@/components/share/ShareViewClient';

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  return <ShareViewClient token={token} />;
}
