import fastGlob from 'fast-glob';
import fastSafeStringify from 'fast-safe-stringify';
import { replaceSepToPosix } from 'my-node-fp';
import * as path from 'path';
import * as tsm from 'ts-morph';

/** create set, dedupe duplicated element after return array type */
export function settify<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function posixJoin(...args: string[]): string {
  return replaceSepToPosix(path.join(...args));
}

export async function fastGlobWrap(
  pattern: string | string[],
  options: Parameters<typeof fastGlob>[1],
) {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const unixifyPatterns = patterns.map((nonUnixifyPattern) => replaceSepToPosix(nonUnixifyPattern));
  const unixifyFiles = await fastGlob(unixifyPatterns, options);
  const files = unixifyFiles.map((file) => file.replace(/\//g, path.sep));
  return files;
}

export function getTestValue<T>(testData: T) {
  const stringifiedString = fastSafeStringify(
    testData,
    (_key, value) => {
      if (value === '[Circular]') {
        return undefined;
      }

      if (value instanceof tsm.Node) {
        return undefined;
      }

      return value;
    },
    2,
  );

  return JSON.parse(stringifiedString);
}
