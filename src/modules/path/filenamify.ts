import { getExtname } from '#/modules/path/getExtname';
import { camelCase } from 'change-case';
import doFilenamify from 'filenamify';
import path from 'path';

export function filenamify(filename: string): string {
  const basename = path.basename(filename, getExtname(filename));

  if (/^([A-Z])(.+)/.test(basename)) {
    const camel = camelCase(basename);
    const upperFirstCase = camel.charAt(0).toUpperCase() + camel.slice(1);
    return doFilenamify(upperFirstCase);
  }

  const raw = camelCase(basename);
  return doFilenamify(raw);
}
