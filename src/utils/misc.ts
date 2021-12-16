export function min(num: number, limit: number): number {
  return num >= limit ? limit : num;
}

export function formatDur(seconds: number): string {
  if (seconds < 0) return 'unlimited';
  if (seconds < 60) return `${seconds}s`;

  const rem = seconds % 60;
  const min = ~~(seconds / 60);

  return rem ? `${min}m ${rem}s` : `${min}m`;
}

export function formatDist(meter: number): string {
  if (meter < 0) return '-';
  meter = Math.round(meter);
  if (meter < 1000) return meter + ' m';
  return new Intl.NumberFormat('en', {
    style: 'unit',
    unit: 'kilometer',
  }).format(meter / 1000);
}
