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

export function toggleDOMNode<T extends Node>(
  element: HTMLElement,
  container: T
): () => void {
  element.style.display = 'block';
  container.appendChild(element);

  return () => {
    element.style.display = 'none';
    document.body.appendChild(element);
  };
}
