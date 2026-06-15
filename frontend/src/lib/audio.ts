const API_PROXY_PREFIX = '/api/backend';

export function resolveAudioUrl(audioPath: string): string {
  if (audioPath.startsWith('http')) return audioPath;
  if (audioPath.startsWith(API_PROXY_PREFIX)) return audioPath;
  return `${API_PROXY_PREFIX}${audioPath}`;
}

export async function playWordAudio(audioPath: string): Promise<void> {
  const url = resolveAudioUrl(audioPath);
  const response = await fetch(url, { credentials: 'include' });

  if (!response.ok) return;

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);

  audio.addEventListener('ended', () => URL.revokeObjectURL(objectUrl));
  await audio.play();
}
