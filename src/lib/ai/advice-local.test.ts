import { describe, expect, it } from 'vitest';
import { defaultCV } from '@/utils/cv.utils';
import { buildLocalAdvice } from './advice-local';

describe('advice-local', () => {
  it('retourne des conseils et reformulations', () => {
    const result = buildLocalAdvice(defaultCV());
    expect(result.tips.length).toBeGreaterThanOrEqual(3);
    expect(result.tips.length).toBeLessThanOrEqual(5);
    expect(result.source).toBe('local');
  });
});
