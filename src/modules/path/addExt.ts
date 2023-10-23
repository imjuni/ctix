export function addExt(filename: string, ext: string) {
  if (filename.endsWith('.')) {
    return [filename.trim(), ext.trim()].join('');
  }

  return [filename.trim(), ext.trim()].join('.');
}
