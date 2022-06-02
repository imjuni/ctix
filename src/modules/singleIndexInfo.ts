import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import getFilePathOnIndex from '@modules/getFilePathOnIndex';
import ICreateIndexInfo from '@tools/interface/ICreateIndexInfo';
import getOutputDir from '@writes/getOutputDir';
import { isEmpty, isNotEmpty } from 'my-easy-fp';
import * as tsm from 'ts-morph';

export default function singleIndexInfo(
  exportInfo: IExportInfo,
  option: TOptionWithResolvedProject,
  project: tsm.Project,
): ICreateIndexInfo[] {
  const outputDir = getOutputDir(project, option);

  if (
    exportInfo.starExported &&
    isNotEmpty(exportInfo.defaultExport) &&
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
        exportStatement: `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (exportInfo.starExported && isEmpty(exportInfo.defaultExport)) {
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

  if (isNotEmpty(exportInfo.defaultExport) && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);
    const statement = exportInfo.namedExports
      .map((namedExport) => namedExport.identifier)
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
        exportStatement: `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  if (isEmpty(exportInfo.defaultExport) && exportInfo.namedExports.length > 0) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);
    const statement = exportInfo.namedExports
      .map((namedExport) => namedExport.identifier)
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

  if (isNotEmpty(exportInfo.defaultExport)) {
    const filePath = getFilePathOnIndex(exportInfo.resolvedFilePath, option, outputDir);

    return [
      {
        depth: exportInfo.depth,
        resolvedFilePath: exportInfo.resolvedFilePath,
        resolvedDirPath: outputDir,
        exportStatement: `export { default as ${exportInfo.defaultExport.identifier} } from ${filePath}`,
      },
    ];
  }

  return [];
}
