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

// Formats distance
export function formatDist(meter: number, toFixed = 1): string {
  if (meter < 0) return '-';
  if (meter < 1000) {
    return meter.toFixed(toFixed) + ' m';
  }
  return (meter / 1000).toFixed(toFixed) + ' km';
}

export function unsafeToggleHTMLElement<T extends HTMLElement>(
  el: T,
  originContainer: T,
  tempContainer: T
) {
  el.style.display = 'block';
  tempContainer.appendChild(el);
  return () => {
    el.style.display = 'none';
    originContainer.appendChild(el);
  };
}
