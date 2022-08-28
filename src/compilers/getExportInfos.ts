import getExportInfo from '@compilers/getExportInfo';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import isIgnored from '@ignores/isIgnored';
import { isEmpty, isFalse } from 'my-easy-fp';
import { isDescendant } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';
import { AsyncReturnType } from 'type-fest';

export default async function getExportInfos(
  project: tsm.Project,
  option: TCreateOrSingleOption,
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
) {
  const sourceFiles = project
    .getSourceFiles()
    .filter((sourceFile) =>
      isDescendant(option.startAt, sourceFile.getFilePath().toString(), path.posix.sep),
    )
    .filter(
      (sourceFile) => path.basename(sourceFile.getFilePath().toString()) !== option.exportFilename,
    )
    .filter((sourceFile) => isFalse(isIgnored(ignores, sourceFile.getFilePath().toString())));

  const exportInfos = (
    await Promise.all(sourceFiles.map((sourceFile) => getExportInfo(sourceFile, option, ignores)))
  ).filter((exportInfo) => isFalse(exportInfo.isEmpty));

  const exportRecord = exportInfos.reduce<Record<string, IExportInfo>>(
    (aggregation, exportInfo) => {
      if (isEmpty(aggregation[exportInfo.resolvedFilePath])) {
        return { ...aggregation, [exportInfo.resolvedFilePath]: exportInfo };
      }

      return aggregation;
    },
    {},
  );

  return Object.values(exportRecord);
}
