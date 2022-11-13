import getRefineIgnorePath from '@ignores/getRefineIgnorePath';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import { posixJoin } from '@tools/misc';
import fs from 'fs';
import ignore, { Ignore } from 'ignore';
import { parse } from 'jsonc-parser';
import { exists } from 'my-node-fp';
import path from 'path';

interface ICtiIgnoreWithWildcardValue {
  type: 'wildcard';
  filePath: string;
  ignore: Ignore;
  pattern: string;
}

interface ICtiIgnoreWithPatternValue {
  type: 'pattern';
  filePath: string;
  ignore: Ignore;
  pattern: string[];
  patternMatcher: Ignore;
}

type TCtiIgnoreWithValue = ICtiIgnoreWithWildcardValue | ICtiIgnoreWithPatternValue;

interface IGetCtiignoreFilesReturn {
  origin: IGetIgnoredConfigContents;
  ignore: Ignore;
  withValue: TCtiIgnoreWithValue[];
}

export default async function getCtiignoreFiles(
  cwd: string,
  filePath: string,
): Promise<IGetCtiignoreFilesReturn> {
  try {
    if ((await exists(filePath)) === false) {
      throw new Error(`invalid ignore filePath: ${filePath}`);
    }

    const fileBuf = await fs.promises.readFile(filePath);
    const ignoreFiles: IGetIgnoredConfigContents = parse(fileBuf.toString());
    const ig: IGetCtiignoreFilesReturn = { origin: ignoreFiles, ignore: ignore(), withValue: [] };

    ig.ignore.add(
      Object.keys(ignoreFiles)
        .map((ignoreFile) =>
          path.isAbsolute(ignoreFile) ? ignoreFile : posixJoin(cwd, ignoreFile),
        )
        .map((pattern) => getRefineIgnorePath(pattern)),
    );

    ig.withValue = Object.entries(ignoreFiles).map((ignoreFile) => {
      const [ignoreFilePathKey, pattern] = ignoreFile;
      const subIgnore = ignore().add(
        [ignoreFilePathKey]
          .map((filePathKey) =>
            path.isAbsolute(filePathKey) ? filePathKey : posixJoin(cwd, filePathKey),
          )
          .map((filePathKey) => getRefineIgnorePath(filePathKey)),
      );

      if (typeof pattern === 'string') {
        const ignoreWithWildcardValue: ICtiIgnoreWithWildcardValue = {
          type: 'wildcard',
          ignore: subIgnore,
          filePath: ignoreFilePathKey,
          pattern,
        };

        return ignoreWithWildcardValue;
      }

      const patternMatcher = ignore().add(pattern);
      const ignoreWithPatternValue: ICtiIgnoreWithPatternValue = {
        type: 'pattern',
        ignore: subIgnore,
        filePath: ignoreFilePathKey,
        pattern,
        patternMatcher,
      };

      return ignoreWithPatternValue;
    });

    return ig;
  } catch {
    return { origin: {}, ignore: ignore(), withValue: [] };
  }
}
