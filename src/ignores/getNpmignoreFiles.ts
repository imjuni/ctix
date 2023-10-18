import { posixJoin } from '#/tools/misc';
import fs from 'fs';
import { exists, getDirname } from 'my-node-fp';
import type gitignore from 'parse-gitignore';
import { parse as parseGitignore } from 'parse-gitignore';
import path from 'path';

export async function getNpmignoreFiles(
  filePath: string,
): Promise<{ patterns: string[]; origin: string[]; state?: gitignore.State }> {
  try {
    if ((await exists(filePath)) === false) {
      return { patterns: [], origin: [], state: undefined };
    }

    const fileBuf = await fs.promises.readFile(filePath);
    const dirPath = await getDirname(filePath);
    const parsedIgnoreFile = parseGitignore(fileBuf.toString());
    const patterns = parsedIgnoreFile.patterns.map((pattern) =>
      path.isAbsolute(pattern) ? pattern : posixJoin(dirPath, pattern),
    );

    return { patterns, origin: parsedIgnoreFile.patterns, state: parsedIgnoreFile };
  } catch {
    return { patterns: [], origin: [], state: undefined };
  }
}
