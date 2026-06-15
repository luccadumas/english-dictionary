import { describe, expect, it } from 'vitest';
import { resolveAudioUrl } from '@/lib/audio';

describe('resolveAudioUrl', () => {
  it('returns external URLs unchanged', () => {
    expect(resolveAudioUrl('https://example.com/audio.mp3')).toBe(
      'https://example.com/audio.mp3',
    );
  });

  it('prefixes backend paths with the API proxy', () => {
    expect(resolveAudioUrl('/entries/en/fire/audio/0')).toBe(
      '/api/backend/entries/en/fire/audio/0',
    );
  });

  it('does not double-prefix proxied paths', () => {
    expect(resolveAudioUrl('/api/backend/entries/en/fire/audio/0')).toBe(
      '/api/backend/entries/en/fire/audio/0',
    );
  });
});
