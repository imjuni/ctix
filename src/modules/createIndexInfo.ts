import type { IExportInfo } from '#/compilers/interfaces/IExportInfo';
import type { TCreateOrSingleOption } from '#/configs/interfaces/IOption';
import { getFilePathOnIndex } from '#/modules/getFilePathOnIndex';
import type { ICreateIndexInfo } from '#/tools/interface/ICreateIndexInfo';
import { getDirnameSync } from 'my-node-fp';

export function createIndexInfo(
  exportInfo: IExportInfo,
  option: TCreateOrSingleOption,
): ICreateIndexInfo[] {
  if (
    exportInfo.starExported &&
    exportInfo.defaultExport != null &&
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
        exportStatement: exportInfo.defaultExport.isIsolatedModules
          ? `export type { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`
          : `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.starExported && exportInfo.defaultExport == null) {
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

  if (exportInfo.defaultExport != null && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);
    const statement = exportInfo.namedExports
      .map((namedExport) =>
        namedExport.isIsolatedModules
          ? `type ${namedExport.identifier}`
          : `${namedExport.identifier}`,
      )
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
        exportStatement: exportInfo.defaultExport.isIsolatedModules
          ? `export type { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`
          : `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.defaultExport == null && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);
    const statement = exportInfo.namedExports
      .map((namedExport) =>
        namedExport.isIsolatedModules
          ? `type ${namedExport.identifier}`
          : `${namedExport.identifier}`,
      )
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

  if (exportInfo.defaultExport != null) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: getDirnameSync(exportInfo.resolvedFilePath),
        exportStatement: exportInfo.defaultExport.isIsolatedModules
          ? `export type { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`
          : `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  return [];
}
