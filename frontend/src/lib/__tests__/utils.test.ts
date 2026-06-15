import { describe, expect, it } from 'vitest';
import { cn, formatDate } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('formatDate', () => {
  it('formats ISO date in en-US locale', () => {
    const formatted = formatDate('2024-05-05T19:28:13.531Z', 'en');
    expect(formatted).toMatch(/2024/);
    expect(formatted).toMatch(/May/i);
  });

  it('formats ISO date in pt-BR locale', () => {
    const formatted = formatDate('2024-05-05T19:28:13.531Z', 'pt-BR');
    expect(formatted).toMatch(/2024/);
    expect(formatted).toMatch(/mai/i);
  });
});
