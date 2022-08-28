import getExportedName from '@compilers/getExportedName';
import getIsIsolatedModules from '@compilers/getIsIsolatedModules';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getCtiIgnorePattern from '@ignores/getCtiIgnorePattern';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getRelativeDepth from '@tools/getRelativeDepth';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
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

  return isEmpty(ignoreInFile);
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
  const defaultExportedDeclarations = exportedDeclarationsMap.get('default')?.at(0);
  const defaultExportedName = isNotEmpty(defaultExportedDeclarations)
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
        return isFalse(ignoreInFile.includes(name));
      }

      return isEmpty(ignoreInFile);
    })
    .map((exportedDeclarationsWithKey) => {
      const [, exportedDeclarations] = exportedDeclarationsWithKey;
      const [exportedDeclaration] = exportedDeclarations;
      return {
        identifier: getExportedName(exportedDeclaration),
        node: exportedDeclaration,
        isIsolatedModules: getIsIsolatedModules(exportedDeclaration),
      };
    });

  const relativeFilePath = path.relative(getDirnameSync(option.project), filePath);
  const defaultExport =
    isNotEmpty(defaultExportedName) &&
    isFalse((ignoreInFile ?? []).includes(defaultExportedName.identifier))
      ? defaultExportedName
      : undefined;

  const exportInfo: IExportInfo = {
    isEmpty: isEmpty(defaultExport) && namedExports.length <= 0,
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
