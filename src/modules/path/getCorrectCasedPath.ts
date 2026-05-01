/* eslint-disable no-continue, no-await-in-loop */
import { getSep } from '#/modules/path/getSep';
import { atOrThrow, orThrow } from 'my-easy-fp';
import { replaceSepToPosix } from 'my-node-fp';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Get the correct cased file path by comparing with actual filesystem.
 * This resolves case sensitivity issues on case-insensitive filesystems like macOS/Windows.
 *
 * @param inputPath - The file path that may have incorrect casing
 * @returns The file path with correct casing matching the actual filesystem
 */
export async function getCorrectCasedPath(inputPath: string): Promise<string> {
  // In the type14 scenario, sourceFile.getFilePath incorrectly returns SomeApiService.ts or SomeAPIService.ts.
  // This is a problem that occurs on case-insensitive OSes like Windows and macOS.
  // A way to correctly fix this needs to be investigated.
  // type14 상황에서 sourceFile.getFilePath 함수가 SomeApiService.ts 또는 SomeAPIService.ts를
  // 잘못 반환하는 이슈가 있다. window, macOS와 같이 case-sensitive가 아닌 OS에서 발생하는 문제이다.
  // 이 부분을 올바르게 수정할 수 있는 방법을 연구해야 한다.
  // https://github.com/microsoft/TypeScript/issues/50544
  // https://github.com/microsoft/TypeScript/issues/54642
  // https://github.com/microsoft/TypeScript/issues/26157
  // https://github.com/microsoft/TypeScript/issues/17617
  try {
    // Get separator once and reuse
    const sep = getSep();

    // Normalize the path first to handle relative paths properly
    const normalizedPath = path.normalize(inputPath);
    const resolvedPath = path.isAbsolute(normalizedPath)
      ? normalizedPath
      : path.resolve(normalizedPath);
    const segments = resolvedPath.split(sep).filter((segment) => segment !== '');

    // Start with root for absolute paths
    let correctedPath = resolvedPath.startsWith(sep) ? sep : '';

    // Handle Windows drive letter (C:, D:, etc.)
    const firstSegment = atOrThrow(segments, 0);
    if (os.platform() === 'win32' && firstSegment.endsWith(':')) {
      correctedPath = firstSegment + sep;
      segments.shift(); // Remove drive letter from segments
    }

    for (const currentSegment of segments) {
      const safeSegment = orThrow(currentSegment);
      const parentPath = correctedPath;

      // Check if the current segment exists with correct casing
      try {
        const actualEntries = await fs.promises.readdir(parentPath);
        const correctEntry = actualEntries.find(
          (entry) => entry.toLowerCase() === safeSegment.toLowerCase(),
        );

        if (correctEntry != null) {
          correctedPath = path.join(correctedPath, correctEntry);
        } else {
          // If not found, keep the original casing
          correctedPath = path.join(correctedPath, safeSegment);
        }
      } catch {
        // If parent directory doesn't exist, keep original casing and return
        correctedPath = path.join(correctedPath, safeSegment);
        break;
      }
    }

    // Normalize to posix separators so callers always receive forward-slash paths
    // regardless of the platform (Windows uses backslashes with path.join).
    return replaceSepToPosix(correctedPath);
  } catch {
    // If any error occurs, return the original path
    return replaceSepToPosix(inputPath);
  }
}
