import {
  rewriteWordAudioUrls,
  extractAudioUrl,
} from '@/modules/dictionary/utils/word-audio.util';

describe('word-audio.util', () => {
  const sample = [
    {
      word: 'fire',
      phonetics: [
        { text: '/faɪər/', audio: 'https://api.dictionaryapi.dev/media/en/fire.mp3' },
        { text: '/faɪr/' },
      ],
    },
  ];

  it('rewrites external audio URLs to proxied paths', () => {
    const rewritten = rewriteWordAudioUrls('fire', sample) as typeof sample;
    expect(rewritten[0].phonetics[0].audio).toBe('/entries/en/fire/audio/0');
    expect(rewritten[0].phonetics[1].audio).toBeUndefined();
  });

  it('extracts original audio URL by index', () => {
    expect(extractAudioUrl(sample, 0)).toBe(
      'https://api.dictionaryapi.dev/media/en/fire.mp3',
    );
    expect(extractAudioUrl(sample, 1)).toBeNull();
  });
});
