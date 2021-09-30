export function min(num: number, limit: number): number {
  return num >= limit ? limit : num;
}

export function formatDuration(seconds: number): string {
  if (seconds < 0) return 'unlimited';
  if (seconds < 60) return `${seconds}s`;

  const rem = seconds % 60;
  const min = ~~(seconds / 60);

  return rem ? `${min}m ${rem}s` : `${min}m`;
}

export function __unsafeToggleElement<
  T extends HTMLElement,
  K extends HTMLElement
>(el: T, containerRef: K) {
  el.style.display = 'block';
  containerRef.appendChild(el);
  return () => {
    el.style.display = 'none';
    document.body.appendChild(el);
  };
}
