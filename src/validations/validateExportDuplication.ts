import IReason from '@cli/interfaces/IReason';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import IIdentifierWithNode from '@compilers/interfaces/IIdentifierWithNode';
import chalk from 'chalk';
import { isNotEmpty, settify } from 'my-easy-fp';

function createReason(exportInfo: IExportInfo, identifier: string) {
  if (isNotEmpty(exportInfo.defaultExport) && exportInfo.defaultExport.identifier === identifier) {
    const lineAndCharacter = exportInfo.defaultExport.node
      .getSourceFile()
      .getLineAndColumnAtPos(exportInfo.defaultExport.node.getStart(true));

    const reason: IReason = {
      type: 'error',
      lineAndCharacter: { line: lineAndCharacter.line, character: lineAndCharacter.column },
      nodes: [exportInfo.defaultExport.node],
      source: exportInfo.defaultExport.node.getSourceFile(),
      filePath: exportInfo.resolvedFilePath,
      message: `detect same name of default export statement: "${chalk.yellow(identifier)}"`,
    };

    return [reason];
  }

  return exportInfo.namedExports
    .filter((namedExport) => namedExport.identifier === identifier)
    .map((namedExport) => {
      const lineAndCharacter = namedExport.node
        .getSourceFile()
        .getLineAndColumnAtPos(namedExport.node.getStart(true));

      const reason: IReason = {
        type: 'error',
        lineAndCharacter: { line: lineAndCharacter.line, character: lineAndCharacter.column },
        nodes: [namedExport.node],
        source: namedExport.node.getSourceFile(),
        filePath: exportInfo.resolvedFilePath,
        message: `detect same name of export statement: "${chalk.yellow(identifier)}"`,
      };

      return reason;
    });
}

/**
 * Detect export duplication from every typescript source file.
 *
 * @param exportInfos export statements from every typescript source file
 * @returns
 */
export default function validateExportDuplication(exportInfos: IExportInfo[]) {
  const exportInfoRecord = exportInfos.reduce<Record<string, IExportInfo[]>>(
    (aggregation, exportInfo) => {
      const next = { ...aggregation };
      const exportedNames = [exportInfo.defaultExport, ...exportInfo.namedExports].filter(
        (exportedName): exportedName is IIdentifierWithNode => isNotEmpty(exportedName),
      );

      exportedNames.forEach((exportedName) => {
        next[exportedName.identifier] = [...(next[exportedName.identifier] ?? []), exportInfo];
      });

      return next;
    },
    {},
  );

  const duplicateRecord = Object.entries(exportInfoRecord)
    .filter((exportPair) => {
      const [, exportInfo] = exportPair;
      return exportInfo.length > 1;
    })
    .reduce<Record<string, IExportInfo[]>>((aggregation, exportPair) => {
      const [identifier, exportInfo] = exportPair;
      return { ...aggregation, [identifier]: exportInfo };
    }, {});

  const reasons: IReason[] = Object.entries(duplicateRecord)
    .map((exportPair) => {
      const [identifier, duplicateExportInfos] = exportPair;
      return duplicateExportInfos
        .map((exportInfo) => createReason(exportInfo, identifier))
        .flatMap((nonFlatted) => nonFlatted);
    })
    .flatMap((nonFlatted) => nonFlatted);

  const filePaths = settify(
    Object.values(duplicateRecord)
      .map((duplicateRecordElement) => {
        return duplicateRecordElement.map((element) => element.resolvedFilePath);
      })
      .flatMap((nonFlatted) => nonFlatted)
      .filter((filePath): filePath is string => isNotEmpty(filePath) && filePath !== ''),
  );

  return {
    valid: Object.keys(duplicateRecord).length <= 0,
    filePaths: Array.from(new Set(filePaths)),
    duplicate: duplicateRecord,
    reasons,
  };
}
