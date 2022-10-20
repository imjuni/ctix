import { posixJoin } from '@tools/misc';
import fs from 'fs';
import ignore, { Ignore } from 'ignore';
import { exists, getDirname } from 'my-node-fp';
import gitignore, { parse as parseGitignore } from 'parse-gitignore';
import getRefineIgnorePath from './getRefineIgnorePath';

export default async function getGitignoreFiles(
  filePath: string,
): Promise<{ patterns: string[]; state?: gitignore.State; ignore: Ignore }> {
  try {
    if ((await exists(filePath)) === false) {
      throw new Error('invalid .gitignore filepath');
    }

    const fileBuf = await fs.promises.readFile(filePath);
    const dirPath = await getDirname(filePath);
    const parsedIgnoreFile = parseGitignore(fileBuf.toString());
    const ig: { patterns: string[]; parsed: gitignore.State; ignore: Ignore } = {
      parsed: parsedIgnoreFile,
      patterns: parsedIgnoreFile.patterns,
      ignore: ignore(),
    };

    ig.ignore.add(
      parsedIgnoreFile.patterns
        .map((pattern) => posixJoin(dirPath, pattern))
        .map((pattern) => getRefineIgnorePath(pattern)),
    );

    return ig;
  } catch {
    return { patterns: [], state: undefined, ignore: ignore() };
  }
}
