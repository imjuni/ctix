import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export interface IGetIgnoreConfigFiles {
  git: string;
  cti: string;
  npm: string;
}

/**
 * extract create-ts-index ignore file by glob pattern in cwd(current working directory)
 *
 * @param cwd current working directory
 * @returns return value is eithered. string array or error class.
 */
export default async function getIgnoreConfigFiles(cwd: string): Promise<IGetIgnoreConfigFiles> {
  const resolvedCWD = path.resolve(cwd); // absolute path

  // create gitignore glob pattern
  const gitignorePattern = replaceSepToPosix(path.join(resolvedCWD, '.gitignore'));

  // create ctiignore glob pattern
  const ctiignorePattern = replaceSepToPosix(path.join(resolvedCWD, '.ctiignore'));

  // create npmignore glob pattern
  const npmignorePattern = replaceSepToPosix(path.join(resolvedCWD, '.npmignore'));

  // ctiignore file have dot charactor at file first so set true dot flag
  const ignoreFiles = {
    git: gitignorePattern,
    cti: ctiignorePattern,
    npm: npmignorePattern,
  };

  return ignoreFiles;
}
