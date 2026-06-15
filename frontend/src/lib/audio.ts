import { getTokenFromCookie } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export function resolveAudioUrl(audioPath: string): string {
  if (audioPath.startsWith('http')) return audioPath;
  return `${API_URL}${audioPath}`;
}

export async function playWordAudio(audioPath: string): Promise<void> {
  const url = resolveAudioUrl(audioPath);
  const token = getTokenFromCookie();

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) return;

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);

  audio.addEventListener('ended', () => URL.revokeObjectURL(objectUrl));
  await audio.play();
}
