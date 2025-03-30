export function getString(buf: Buffer | string): string {
  return typeof buf === 'string' ? buf : buf.toString();
}
