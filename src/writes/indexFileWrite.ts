import IReason from '@cli/interfaces/IReason';
import { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import dayjs from 'dayjs';
import fs from 'fs';
import { isFalse, isNotEmpty } from 'my-easy-fp';
import { exists } from 'my-node-fp';
import os from 'os';
import path from 'path';

function getFirstLineComment(option: TOptionWithResolvedProject): string {
  const today = dayjs();

  if (option.useComment && option.useTimestamp) {
    return `// created from ctix ${today.format('YYYY-MM-DD HH:mm:ss')}${os.EOL}${os.EOL}`;
  }

  if (option.useComment) {
    return `// created from ctix${os.EOL}${os.EOL}`;
  }

  if (option.useTimestamp) {
    return `// ${today.format('YYYY-MM-DD HH:mm:ss')}${os.EOL}${os.EOL}`;
  }

  return '';
}

export default async function indexFileWrite(
  indexInfos: ICreateIndexInfos[],
  option: TOptionWithResolvedProject,
) {
  const nullableReasons = await Promise.all(
    indexInfos.map(async (indexInfo) => {
      const indexFilePath = path.join(indexInfo.resolvedDirPath, option.exportFilename);
      const indexFileContent = indexInfo.exportStatements.join(os.EOL);
      const firstLine = getFirstLineComment(option);

      if (isFalse(await exists(indexFilePath))) {
        await fs.promises.writeFile(indexFilePath, `${firstLine}${indexFileContent}`);
        return undefined;
      }

      const reason: IReason = {
        type: 'error',
        filePath: indexFilePath,
        message: `Already exist "${option.exportFilename}": ${indexFilePath}`,
      };

      return reason;
    }),
  );

  const reasons = nullableReasons.filter((reason): reason is IReason => isNotEmpty(reason));

  return reasons;
}
