export async function isServerAvailable(): Promise<boolean> {
  const response = await fetch('/api/health', {
    signal: AbortSignal.timeout(3000),
    cache: 'no-store',
  });

  if (!response.ok) {
    return false;
  }

  const health: { status?: unknown } | null = await response.json();
  return health?.status === 'ok';
}
