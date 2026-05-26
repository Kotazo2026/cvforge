export function headerFieldKey(field: 'summary' | 'jobTitle' | 'firstName' | 'lastName'): string {
  return `header:${field}`;
}

export function entryFieldKey(
  sectionId: string,
  entryId: string,
  field: 'title' | 'description' | 'subtitle',
): string {
  return `entry:${sectionId}:${entryId}:${field}`;
}

export function parseFieldKey(
  key: string,
):
  | { type: 'header'; field: 'summary' | 'jobTitle' | 'firstName' | 'lastName' }
  | { type: 'entry'; sectionId: string; entryId: string; field: 'title' | 'description' | 'subtitle' }
  | null {
  if (key.startsWith('header:')) {
    const field = key.slice(7) as 'summary' | 'jobTitle' | 'firstName' | 'lastName';
    return { type: 'header', field };
  }
  const entryMatch = key.match(/^entry:([^:]+):([^:]+):(title|description|subtitle)$/);
  if (entryMatch) {
    return {
      type: 'entry',
      sectionId: entryMatch[1],
      entryId: entryMatch[2],
      field: entryMatch[3] as 'title' | 'description' | 'subtitle',
    };
  }
  return null;
}
