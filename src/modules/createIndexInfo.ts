import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getFilePathOnIndex from '@modules/getFilePathOnIndex';
import ICreateIndexInfo from '@tools/interface/ICreateIndexInfo';
import { isEmpty, isNotEmpty } from 'my-easy-fp';
import { getDirnameSync } from 'my-node-fp';

export default function createIndexInfo(
  exportInfo: IExportInfo,
  option: TCreateOrSingleOption,
): ICreateIndexInfo[] {
  if (
    exportInfo.starExported &&
    isNotEmpty(exportInfo.defaultExport) &&
    exportInfo.namedExports.length > 0
  ) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export * from ${filePath}`,
      },
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export ${
          exportInfo.defaultExport.isIsolatedModules ? 'type ' : ''
        }{ default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.starExported && isEmpty(exportInfo.defaultExport)) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export * from ${filePath}`,
      },
    ];
  }

  if (isNotEmpty(exportInfo.defaultExport) && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);
    const statement = exportInfo.namedExports
      .map((namedExport) => namedExport.identifier)
      .join(', ');

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export { ${statement} } from ${filePath}`,
      },
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export ${
          exportInfo.defaultExport.isIsolatedModules ? 'type ' : ''
        }{ default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (isEmpty(exportInfo.defaultExport) && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);
    const statement = exportInfo.namedExports
      .map((namedExport) => namedExport.identifier)
      .join(', ');

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export { ${statement} } from ${filePath}`,
      },
    ];
  }

  if (isNotEmpty(exportInfo.defaultExport)) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: `export ${
          exportInfo.defaultExport.isIsolatedModules ? 'type ' : ''
        }{ default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  return [];
}
