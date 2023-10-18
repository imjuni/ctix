import type { IReason } from '#/cli/interfaces/IReason';
import type { TCreateOrSingleOption } from '#/configs/interfaces/IOption';
import type { ICreateIndexInfos } from '#/tools/interface/ICreateIndexInfos';
import { getDirective } from '#/writes/getDirective';
import { getFirstLineComment } from '#/writes/getFirstLineComment';
import { prettierApply } from '#/writes/prettierApply';
import chalk from 'chalk';
import dayjs from 'dayjs';
import fs from 'fs';
import { exists } from 'my-node-fp';
import path from 'path';

export async function indexFileWrite(
  indexInfos: ICreateIndexInfos[],
  option: TCreateOrSingleOption,
) {
  const nullableReasons = await Promise.all(
    indexInfos.map(async (indexInfo) => {
      const indexFilePath = path.join(indexInfo.resolvedDirPath, option.exportFilename);
      const indexFileContent = indexInfo.exportStatements.join(option.eol);
      const firstLine = [
        getDirective(option, option.eol),
        getFirstLineComment(option, option.eol, dayjs()),
      ].join('');
      const prettierApplied = await prettierApply(
        option.project,
        `${indexFileContent}${option.eol}`,
      );

      if ((option.overwrite ?? false) === true) {
        // index.ts file already exist, create backup file
        if ((await exists(indexFilePath)) && option.noBackup === false) {
          await fs.promises.writeFile(
            `${indexFilePath}.bak`,
            await fs.promises.readFile(indexFilePath),
          );
        }

        await fs.promises.writeFile(
          indexFilePath,
          `${`${firstLine}${prettierApplied.contents}`.trim()}${option.eol}`,
        );

        return undefined;
      }

      if ((await exists(indexFilePath)) === false) {
        await fs.promises.writeFile(
          indexFilePath,
          `${`${firstLine}${prettierApplied.contents}`.trim()}${option.eol}`,
        );

        return undefined;
      }

      const reason: IReason = {
        type: 'error',
        filePath: indexFilePath,
        message: `Already exist "${option.exportFilename}": "${chalk.yellow(indexFilePath)}"`,
      };

      return reason;
    }),
  );

  const reasons = nullableReasons.filter((reason): reason is IReason => reason != null);

  return reasons;
}
