import { camelCase } from 'change-case';
import path from 'path';
import { upperCaseFirst } from 'upper-case-first';

export default function getRefinedFilename(filename: string): string {
  const basename = path.basename(filename, path.extname(filename));

  if (/^([A-Z])(.+)/.test(basename)) {
    return upperCaseFirst(camelCase(basename));
  }

  return camelCase(basename);
}
