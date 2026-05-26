import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildLocalChatResponse } from './chat-local';
import { hasPatchChanges } from './chat-proposal';

describe('chat-local', () => {
  it('propose un raccourcissement', () => {
    const result = buildLocalChatResponse(defaultCV(), 'Mon CV est trop long, raccourcis-le');
    expect(result.patch?.summary).toBeTruthy();
    expect(hasPatchChanges(defaultCV(), result.patch!)).toBe(true);
  });

  it('répond sans patch pour une question générale', () => {
    const result = buildLocalChatResponse(defaultCV(), 'Bonjour');
    expect(result.reply.length).toBeGreaterThan(10);
    expect(result.source).toBe('local');
  });
});
