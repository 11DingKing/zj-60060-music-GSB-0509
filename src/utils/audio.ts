export function imageToBase64(
  data: number[] | Uint8Array,
  format: string
): string {
  const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return `data:${format};base64,${btoa(binary)}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
