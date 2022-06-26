import IReason from '@cli/interfaces/IReason';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getExtname from '@tools/getExtname';
import colors from 'colors';
import path from 'path';

export default function validateFileNameDuplication(
  exportInfos: IExportInfo[],
  option: TCreateOrSingleOption,
) {
  if (option.mode === 'single') {
    return {
      valid: true,
      exportInfos: [],
      filePaths: [],
      reasons: [],
    };
  }

  const indexFileName = option.keepFileExt
    ? option.exportFilename
    : path.basename(option.exportFilename, getExtname(option.exportFilename));

  const duplicate = exportInfos.filter((exportInfo) => {
    const baseName = option.keepFileExt
      ? path.basename(exportInfo.resolvedFilePath)
      : path.basename(exportInfo.resolvedFilePath, getExtname(exportInfo.resolvedFilePath));

    return baseName === indexFileName;
  });

  const reasons: IReason[] = Object.values(duplicate).map((exportInfo) => {
    const reason: IReason = {
      type: 'error',
      filePath: exportInfo.resolvedFilePath,
      message: `already exist file: "${colors.yellow(exportInfo.resolvedFilePath)}"`,
    };

    return reason;
  });

  return {
    valid: duplicate.length <= 0,
    exportInfos: duplicate,
    filePaths: duplicate.map((exportInfo) => exportInfo.resolvedFilePath),
    reasons,
  };
}
