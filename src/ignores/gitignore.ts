import consola from 'consola';
import fs from 'fs';
import ignore, { Ignore } from 'ignore';
import { isError } from 'my-easy-fp';
import { existsSync } from 'my-node-fp';
import os from 'os';
import git, { parse as parseGitignore } from 'parse-gitignore';
import path from 'path';
import { ReadonlyDeep } from 'type-fest';

const defaultIgnore = ['**/node_modules', '**/flow-typed', '**/coverage', '**/.git'];

const internalGitIgnore: { git: git.State; ig: Ignore; globPatterns: string[]; default: string[] } =
  { default: defaultIgnore } as any;

const gitignore: ReadonlyDeep<{
  git: git.State;
  ig: Ignore;
  globPatterns: string[];
  default: string[];
}> = internalGitIgnore;

export async function bootstrap(filePath: string) {
  if (existsSync(filePath)) {
    const fileBuf = await fs.promises.readFile(filePath);
    const parsedIngnore = parseGitignore(fileBuf.toString());

    internalGitIgnore.git = parsedIngnore;
    internalGitIgnore.globPatterns = internalGitIgnore.git.patterns
      .map((pattern) => [
        path.posix.join('**', pattern, '**', '*'),
        path.posix.join(pattern, '**', '*'),
      ])
      .flat();
    internalGitIgnore.ig = ignore().add([...defaultIgnore, ...parsedIngnore.patterns]);
  } else {
    internalGitIgnore.globPatterns = [];
    internalGitIgnore.ig = ignore().add([...defaultIgnore]);
  }
}

export function getRefineIgnorePath(filePath: string): string {
  if (os.platform() === 'win32') {
    const matched = /^([a-zA-Z]:)(\/|)(.+)$/.exec(filePath.trim());
    if (matched === null || matched === undefined || matched.length < 4) {
      return filePath.startsWith('/') ? filePath.substring(1) : filePath;
    }
    return matched[3];
  }

  return filePath.startsWith('/') ? filePath.substring(1) : filePath;
}

export function filter(filePaths: string[]): string[] {
  return filePaths.filter((filePath) => {
    try {
      const dir = getRefineIgnorePath(filePath);
      return !internalGitIgnore.ig.ignores(dir);
    } catch (catched) {
      const err = isError(catched) ?? new Error('unknown error raised from gitignore.filter');
      consola.debug(`path: ${filePath}`);
      consola.debug(err);
      return false;
    }
  });
}

export default gitignore;
