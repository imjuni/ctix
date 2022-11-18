import getExportInfo from '@compilers/getExportInfo';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import isIgnored from '@ignores/isIgnored';
import { getDirnameSync, isDescendant } from 'my-node-fp';
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
    .filter((sourceFile) => {
      if (option.mode === 'single' && (option.excludeOnlyOutput ?? false) === true) {
        const dirname = getDirnameSync(sourceFile.getFilePath().toString());
        const resolvedOutput = path.resolve(option.output);

        if (dirname === resolvedOutput) {
          const basename = path.basename(sourceFile.getFilePath().toString());
          return basename !== option.exportFilename;
        }

        return true;
      }

      return path.basename(sourceFile.getFilePath().toString()) !== option.exportFilename;
    })
    .filter((sourceFile) => isIgnored(ignores, sourceFile.getFilePath().toString()) === false);

  const exportInfos = (
    await Promise.all(sourceFiles.map((sourceFile) => getExportInfo(sourceFile, option, ignores)))
  ).filter((exportInfo) => exportInfo.isEmpty === false);

  const exportRecord = exportInfos.reduce<Record<string, IExportInfo>>(
    (aggregation, exportInfo) => {
      if (aggregation[exportInfo.resolvedFilePath] == null) {
        return { ...aggregation, [exportInfo.resolvedFilePath]: exportInfo };
      }

      return aggregation;
    },
    {},
  );

  return Object.values(exportRecord);
}
