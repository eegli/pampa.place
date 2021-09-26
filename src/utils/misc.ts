export function min(num: number, limit: number): number {
  return num >= limit ? limit : num;
}

export function formatDuration(seconds: number) {
  if (seconds < 0) return 'unlimited';
  if (seconds < 60) return `${seconds}s`;

  const rem = seconds % 60;
  const min = ~~(seconds / 60);

  return rem ? `${min}m ${rem}s` : `${min}m`;
}
