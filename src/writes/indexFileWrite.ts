import IReason from '@cli/interfaces/IReason';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import prettierApply from '@writes/prettierApply';
import colors from 'colors';
import dayjs from 'dayjs';
import fs from 'fs';
import { isFalse, isNotEmpty, isTrue } from 'my-easy-fp';
import { exists } from 'my-node-fp';
import path from 'path';

function getFirstLineComment(option: TCreateOrSingleOption): string {
  const today = dayjs();

  if (option.useComment && option.useTimestamp) {
    return `// created from ctix ${today.format('YYYY-MM-DD HH:mm:ss')}${option.eol}${option.eol}`;
  }

  if (option.useComment) {
    return `// created from ctix${option.eol}${option.eol}`;
  }

  if (option.useTimestamp) {
    return `// ${today.format('YYYY-MM-DD HH:mm:ss')}${option.eol}${option.eol}`;
  }

  return '';
}

export default async function indexFileWrite(
  indexInfos: ICreateIndexInfos[],
  option: TCreateOrSingleOption,
) {
  const nullableReasons = await Promise.all(
    indexInfos.map(async (indexInfo) => {
      const indexFilePath = path.join(indexInfo.resolvedDirPath, option.exportFilename);
      const indexFileContent = indexInfo.exportStatements.join(option.eol);
      const firstLine = getFirstLineComment(option);

      if (isTrue(option.overwrite ?? false)) {
        const prettierApplied = await prettierApply(
          option.project,
          `${firstLine}${indexFileContent}${option.eol}`,
        );

        // index.ts file already exist, create backup file
        if (await exists(indexFilePath)) {
          await fs.promises.writeFile(
            `${indexFilePath}.bak`,
            await fs.promises.readFile(indexFilePath),
          );
        }

        await fs.promises.writeFile(
          indexFilePath,
          `${firstLine}${prettierApplied.contents}${option.eol}`,
        );

        return undefined;
      }

      if (isFalse(await exists(indexFilePath))) {
        const prettierApplied = await prettierApply(
          option.project,
          `${firstLine}${indexFileContent}${option.eol}`,
        );

        await fs.promises.writeFile(
          indexFilePath,
          `${firstLine}${prettierApplied.contents}${option.eol}`,
        );

        return undefined;
      }

      const reason: IReason = {
        type: 'error',
        filePath: indexFilePath,
        message: `Already exist "${option.exportFilename}": "${colors.yellow(indexFilePath)}"`,
      };

      return reason;
    }),
  );

  const reasons = nullableReasons.filter((reason): reason is IReason => isNotEmpty(reason));

  return reasons;
}
