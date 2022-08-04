import getRefineIgnorePath from '@ignores/getRefineIgnorePath';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import { posixJoin } from '@tools/misc';
import fs from 'fs';
import ignore, { Ignore } from 'ignore';
import { parse } from 'jsonc-parser';
import { isFalse } from 'my-easy-fp';
import { exists, getDirname } from 'my-node-fp';
import path from 'path';

type TWithValue = Array<{ filePath: string; ignore: Ignore; pattern: string | string[] }>;

interface IGetCtiignoreFilesReturn {
  origin: IGetIgnoredConfigContents;
  ignore: Ignore;
  withValue: TWithValue;
}

export default async function getCtiignoreFiles(
  filePath: string,
): Promise<IGetCtiignoreFilesReturn> {
  try {
    if (isFalse(await exists(filePath))) {
      throw new Error(`invalid ignore filePath: ${filePath}`);
    }

    const fileBuf = await fs.promises.readFile(filePath);
    const dirPath = await getDirname(filePath);
    const ignoreFiles: IGetIgnoredConfigContents = parse(fileBuf.toString());
    const ig: IGetCtiignoreFilesReturn = { origin: ignoreFiles, ignore: ignore(), withValue: [] };

    ig.ignore.add(
      Object.keys(ignoreFiles)
        .map((ignoreFile) =>
          path.isAbsolute(ignoreFile) ? ignoreFile : posixJoin(dirPath, ignoreFile),
        )
        .map((pattern) => getRefineIgnorePath(pattern)),
    );

    ig.withValue = Object.entries(ignoreFiles).map((ignoreFile) => {
      const [ignoreFilePathKey, pattern] = ignoreFile;
      const subIgnore = ignore().add(
        [ignoreFilePathKey]
          .map((filePathKey) =>
            path.isAbsolute(filePathKey) ? filePathKey : posixJoin(dirPath, filePathKey),
          )
          .map((filePathKey) => getRefineIgnorePath(filePathKey)),
      );

      return { ignore: subIgnore, filePath: ignoreFilePathKey, pattern };
    });

    return ig;
  } catch {
    return { origin: {}, ignore: ignore(), withValue: [] };
  }
}