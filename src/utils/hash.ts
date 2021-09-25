export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function id(): string {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
  }
  return str;
}
