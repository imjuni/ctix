import getExportedName from '@compilers/getExportedName';
import getIsIsolatedModules from '@compilers/getIsIsolatedModules';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getCtiIgnorePattern from '@ignores/getCtiIgnorePattern';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getRelativeDepth from '@tools/getRelativeDepth';
import { first } from 'my-easy-fp';
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

function shouldIncludeExport(exportDeclaration: tsm.ExportedDeclarations): boolean {
  const moduleDeclaration = exportDeclaration?.asKind(tsm.SyntaxKind.ModuleDeclaration);
  if (moduleDeclaration != null) {
    return !/^declare module "\*.*";$/.test(moduleDeclaration.getText());
  } else {
    return true;
  }
}

export default async function getExportInfo(
  sourceFile: tsm.SourceFile,
  option: TCreateOrSingleOption,
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
): Promise<IExportInfo> {
  const filePath = sourceFile.getFilePath().toString();
  const dirPath = replaceSepToPosix(path.resolve(await getDirname(filePath)));
  const ignoreInFile = getCtiIgnorePattern(ignores, filePath);
  const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
  const possibleDeclarations = first(exportedDeclarationsMap.get('default'));
  const defaultExportedDeclarations =
    possibleDeclarations && shouldIncludeExport(possibleDeclarations)
      ? possibleDeclarations
      : undefined;
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
    .map(
      ([identifier, exportedDeclarations]) =>
        [identifier, exportedDeclarations.filter(shouldIncludeExport)] as const,
    )
    .filter((exportedDeclarationsWithKey) => {
      const [, exportedDeclarations] = exportedDeclarationsWithKey;

      if (typeof ignoreInFile === 'string') {
        if (ignoreInFile === '*') {
          return false;
        }

        const [firstNode] = exportedDeclarations;
        const name = getExportedName(firstNode);
        return ignoreInFile !== name;
      }

      if (
        Array.isArray(ignoreInFile) &&
        ignoreInFile.length > 0 &&
        typeof ignoreInFile[0] === 'string'
      ) {
        const name = getFirstExportName(exportedDeclarations);
        return ignoreInFile.includes(name) === false;
      }

      return ignoreInFile == null;
    })
    .filter(([, exportedDeclarations]) => exportedDeclarations.length > 0)
    .map((exportedDeclarationsWithKey) => {
      const [, exportedDeclarations] = exportedDeclarationsWithKey;
      const [exportedDeclaration] = exportedDeclarations;
      return {
        identifier: getExportedName(exportedDeclaration),
        node: exportedDeclaration,
        isIsolatedModules: getIsIsolatedModules(...exportedDeclarations),
      };
    });

  const relativeFilePath = path.relative(getDirnameSync(option.project), filePath);
  const defaultExport =
    defaultExportedName != null &&
    (ignoreInFile ?? []).includes(defaultExportedName.identifier) === false
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
