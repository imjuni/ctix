import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import fastGlob from 'fast-glob';
import fs from 'fs';
import { isEmpty, isFalse } from 'my-easy-fp';
import { exists, getDirname, replaceSepToPosix } from 'my-node-fp';
import { parse as parseGitignore } from 'parse-gitignore';
import path from 'path';

export default async function getGitignoreFiles(
  cwd: string,
  filePath: string,
): Promise<IGetIgnoredConfigContents> {
  if (isFalse(await exists(filePath))) {
    return {};
  }

  const fileBuf = await fs.promises.readFile(filePath);
  const dirPath = await getDirname(filePath);
  const parsedIgnoreFile = parseGitignore(fileBuf.toString());
  const ignoreFiles = await fastGlob(parsedIgnoreFile.patterns, { cwd, dot: true });

  const ignoreRecord = ignoreFiles.reduce<IGetIgnoredConfigContents>((aggregation, file) => {
    const key = replaceSepToPosix(path.join(dirPath, file));

    if (isEmpty(aggregation[key])) {
      return { ...aggregation, [key]: '*' };
    }

    return aggregation;
  }, {});

  return ignoreRecord;
}
