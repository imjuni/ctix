import getExportedName from '@compilers/getExportedName';
import getIsIsolatedModules from '@compilers/getIsIsolatedModules';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import IIdentifierWithNode from '@compilers/interfaces/IIdentifierWithNode';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getCtiIgnorePattern from '@ignores/getCtiIgnorePattern';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getRelativeDepth from '@tools/getRelativeDepth';
import fastGlob from 'fast-glob';
import { first, invert } from 'my-easy-fp';
import { getDirname, getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';
import { AsyncReturnType } from 'type-fest';

function getFirstExportName(exportedDeclarations: tsm.ExportedDeclarations[]): string {
  const [exportedDeclaration] = exportedDeclarations;
  const exportedName = getExportedName(exportedDeclaration);
  return exportedName;
}

function isStarExport(ignoreInFile?: string | string[]) {
  if (typeof ignoreInFile === 'string' && ignoreInFile === '*') {
    return false;
  }

  if (Array.isArray(ignoreInFile) && ignoreInFile.length <= 0) {
    return true;
  }

  return ignoreInFile == null;
}

export default async function getExportInfo(
  sourceFile: tsm.SourceFile,
  option: TCreateOrSingleOption,
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
): Promise<IExportInfo> {
  const filePath = sourceFile.getFilePath().toString();
  const dirPath = replaceSepToPosix(path.resolve(await getDirname(filePath)));
  const { pattern: ignoreInFile, matcher: ignoreInFileMatcher } = getCtiIgnorePattern(
    ignores,
    filePath,
  );
  const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
  const defaultExportedDeclarations = first(exportedDeclarationsMap.get('default'));
  const defaultExportedName =
    defaultExportedDeclarations != null
      ? {
          identifier: getExportedName(defaultExportedDeclarations),
          node: defaultExportedDeclarations,
          isIsolatedModules: getIsIsolatedModules(defaultExportedDeclarations),
        }
      : undefined;

  const namedExports = Array.from(exportedDeclarationsMap.entries())
    .filter(([identifier]) => identifier !== 'default')
    .filter((exportedDeclarationsWithKey) => {
      const [, exportedDeclarations] = exportedDeclarationsWithKey;
      const name = getFirstExportName(exportedDeclarations);
      return invert(ignoreInFileMatcher(name));
    })
    .map((exportedDeclarationsWithKey) => {
      const [exportedDeclarationKey, exportedDeclarations] = exportedDeclarationsWithKey;
      const [exportedDeclaration] = exportedDeclarations;

      const identifier = getExportedName(exportedDeclaration);

      if (
        exportedDeclaration.getKind() === tsm.SyntaxKind.ModuleDeclaration &&
        fastGlob.isDynamicPattern(identifier)
      ) {
        const identifierWithNode: IIdentifierWithNode = {
          identifier: exportedDeclarationKey,
          node: exportedDeclaration,
          isIsolatedModules: getIsIsolatedModules(...exportedDeclarations),
          moduleDeclaration: identifier,
        };

        return identifierWithNode;
      }

      if (exportedDeclaration.getKind() === tsm.SyntaxKind.SourceFile) {
        const identifierWithNode: IIdentifierWithNode = {
          identifier: exportedDeclarationKey,
          node: exportedDeclaration,
          isIsolatedModules: getIsIsolatedModules(...exportedDeclarations),
          moduleDeclaration: identifier,
        };

        return identifierWithNode;
      }

      const identifierWithNode: IIdentifierWithNode = {
        identifier,
        node: exportedDeclaration,
        isIsolatedModules: getIsIsolatedModules(...exportedDeclarations),
      };

      return identifierWithNode;
    });

  const relativeFilePath = path.relative(getDirnameSync(option.project), filePath);
  const defaultExport =
    defaultExportedName != null && invert(ignoreInFileMatcher(defaultExportedName.identifier))
      ? defaultExportedName
      : undefined;

  const exportInfo: IExportInfo = {
    isEmpty: defaultExport == null && namedExports.length <= 0,
    resolvedFilePath: replaceSepToPosix(path.resolve(filePath)),
    resolvedDirPath: dirPath,
    relativeFilePath: replaceSepToPosix(relativeFilePath),
    depth: getRelativeDepth(option.startAt, dirPath),
    starExported: isStarExport(ignoreInFile),
    defaultExport,
    namedExports,
  };

  return exportInfo;
}
