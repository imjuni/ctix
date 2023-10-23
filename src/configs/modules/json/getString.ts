export function getString(buf: Buffer | string): string {
  return buf instanceof Buffer ? buf.toString() : buf;
}
