import { camelCase } from 'change-case';
import path from 'path';

export function getRefinedFilename(filename: string): string {
  const basename = path.basename(filename, path.extname(filename));

  if (/^([A-Z])(.+)/.test(basename)) {
    const camel = camelCase(basename);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  return camelCase(basename);
}
