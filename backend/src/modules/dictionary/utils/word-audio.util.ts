interface PhoneticLike {
  audio?: string;
  text?: string;
}

interface WordEntryLike {
  phonetics?: PhoneticLike[];
}

export function rewriteWordAudioUrls(word: string, data: unknown): unknown {
  if (!Array.isArray(data)) return data;

  return data.map((entry) => {
    const typed = entry as WordEntryLike;
    if (!typed.phonetics?.length) return entry;

    return {
      ...typed,
      phonetics: typed.phonetics.map((phonetic, index) => ({
        ...phonetic,
        audio: phonetic.audio
          ? `/entries/en/${encodeURIComponent(word)}/audio/${index}`
          : phonetic.audio,
      })),
    };
  });
}

export function extractAudioUrl(data: unknown, index: number): string | null {
  if (!Array.isArray(data) || data.length === 0) return null;

  const phonetics = (data[0] as WordEntryLike).phonetics;
  if (!phonetics?.[index]?.audio) return null;

  const audio = phonetics[index].audio!;
  if (audio.startsWith('http')) return audio;

  return null;
}
