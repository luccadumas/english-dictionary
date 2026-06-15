export function getBackendApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
}
