import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TSingleOptionWithDirInfo } from '@configs/interfaces/IOption';
import getFilePathOnIndex from '@modules/getFilePathOnIndex';
import ICreateIndexInfo from '@tools/interface/ICreateIndexInfo';
import getOutputDir from '@writes/getOutputDir';
import * as tsm from 'ts-morph';

export default function singleIndexInfo(
  exportInfo: IExportInfo,
  option: TSingleOptionWithDirInfo,
  project: tsm.Project,
): ICreateIndexInfo[] {
  const outputDir = getOutputDir(project, option);

  if (
    exportInfo.starExported &&
    exportInfo.defaultExport != null &&
    exportInfo.namedExports.length > 0
  ) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: outputDir,
        exportStatement: `export * from ${filePath}`,
      },
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: outputDir,
        exportStatement: exportInfo.defaultExport.isIsolatedModules
          ? `export type { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`
          : `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.starExported && exportInfo.defaultExport == null) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: outputDir,
        exportStatement: `export * from ${filePath}`,
      },
    ];
  }

  if (exportInfo.defaultExport != null && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);
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
        resolvedDirPath: outputDir,
        exportStatement: `export { ${statement} } from ${filePath}`,
      },
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: outputDir,
        exportStatement: exportInfo.defaultExport.isIsolatedModules
          ? `export type { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`
          : `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.defaultExport == null && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);
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
        resolvedDirPath: outputDir,
        exportStatement: `export { ${statement} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.defaultExport != null) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: outputDir,
        exportStatement: exportInfo.defaultExport.isIsolatedModules
          ? `export type { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`
          : `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  return [];
}
