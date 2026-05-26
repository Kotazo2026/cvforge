const STOPWORDS = new Set([
  'avec',
  'dans',
  'pour',
  'une',
  'des',
  'les',
  'est',
  'sur',
  'par',
  'que',
  'qui',
  'aux',
  'vos',
  'notre',
  'nous',
  'vous',
  'the',
  'and',
  'for',
  'with',
  'your',
  'our',
  'will',
  'are',
  'this',
  'from',
  'have',
  'been',
  'être',
  'avoir',
  'faire',
  'plus',
  'tout',
  'tous',
  'poste',
  'offre',
  'emploi',
  'mission',
  'missions',
  'profil',
  'recherchons',
  'recherche',
]);

const DEFAULT_ATS_KEYWORDS = [
  'react',
  'typescript',
  'next.js',
  'nextjs',
  'node',
  'agile',
  'scrum',
  'docker',
  'kubernetes',
  'aws',
  'sql',
  'postgresql',
  'api',
  'rest',
  'git',
  'ci/cd',
  'leadership',
  'communication',
  'anglais',
  'français',
];

export function extractKeywords(text: string, limit = 24): string[] {
  const normalized = text.toLowerCase();
  const tokens = normalized.match(
    /[a-zàâäéèêëïîôùûüç0-9+#.]{3,}/gi,
  );

  if (!tokens) return [];

  const counts = new Map<string, number>();
  for (const raw of tokens) {
    const word = raw.trim().replace(/^\.+/, '');
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, limit);
}

export function getAtsKeywordPool(jobOffer: string | undefined): string[] {
  const fromOffer = jobOffer?.trim() ? extractKeywords(jobOffer, 20) : [];
  const merged = [...fromOffer];
  for (const keyword of DEFAULT_ATS_KEYWORDS) {
    if (!merged.includes(keyword)) merged.push(keyword);
  }
  return merged.slice(0, 28);
}

export function inferJobTitleFromOffer(jobOffer: string, fallback: string): string {
  const lines = jobOffer
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const titleLine = lines.find((line) =>
    /^(poste|intitulé|titre|role|position)\s*[:\-]/i.test(line),
  );
  if (titleLine) {
    return titleLine.replace(/^(poste|intitulé|titre|role|position)\s*[:\-]\s*/i, '').trim();
  }

  const shortLine = lines.find(
    (line) => line.length >= 8 && line.length <= 70 && !line.endsWith('.'),
  );
  if (shortLine) return shortLine;

  const keywords = extractKeywords(jobOffer, 3);
  if (keywords.length > 0) {
    return keywords
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return fallback;
}

export function containsKeyword(haystack: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(haystack);
}
