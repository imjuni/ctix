import getExportInfo from '@compilers/getExportInfo';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import { isEmpty, isFalse } from 'my-easy-fp';
import path from 'path';
import * as tsm from 'ts-morph';

export default async function getExportInfos(
  project: tsm.Project,
  option: TCreateOrSingleOption,
  ignores: IGetIgnoredConfigContents,
) {
  const ignoreFileNames = Object.keys(ignores);
  const completlyIgnoreFileNames = ignoreFileNames.filter((ignoreFileName) => {
    const ignoreInfo = ignores[ignoreFileName];

    if (typeof ignoreInfo === 'string' && ignoreInfo === '*') {
      return true;
    }

    if (typeof ignoreInfo === 'string') {
      return false;
    }

    return false;
  });

  const sourceFiles = project
    .getSourceFiles()
    .filter(
      (sourceFile) => path.basename(sourceFile.getFilePath().toString()) !== option.exportFilename,
    )
    .filter((sourceFile) =>
      isFalse(completlyIgnoreFileNames.includes(sourceFile.getFilePath().toString())),
    );

  const exportInfos = await Promise.all(
    sourceFiles.map((sourceFile) => getExportInfo(sourceFile, option, ignores)),
  );

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
