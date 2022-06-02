import getExportedName from '@compilers/getExportedName';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import getRelativeDepth from '@tools/getRelativeDepth';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import { getDirname, getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

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
  ignores: IGetIgnoredConfigContents,
): Promise<IExportInfo> {
  const filePath = sourceFile.getFilePath().toString();
  const ignoreInFile = ignores[filePath];
  const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
  const defaultExportedDeclarations = exportedDeclarationsMap.get('default');
  const defaultExportedName = isNotEmpty(defaultExportedDeclarations)
    ? {
        identifier: getFirstExportName(defaultExportedDeclarations),
        node: defaultExportedDeclarations[0],
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
      return { identifier: getExportedName(exportedDeclaration), node: exportedDeclaration };
    });

  const relativeFilePath = path.relative(getDirnameSync(option.project), filePath);
  const exportInfo: IExportInfo = {
    resolvedFilePath: replaceSepToPosix(path.resolve(filePath)),
    resolvedDirPath: await getDirname(replaceSepToPosix(path.resolve(filePath))),
    relativeFilePath: replaceSepToPosix(relativeFilePath),
    depth: getRelativeDepth(option.topDirs, replaceSepToPosix(path.resolve(filePath))),
    starExported: isStarExport(ignoreInFile),
    defaultExport:
      isNotEmpty(defaultExportedName) &&
      isFalse((ignoreInFile ?? []).includes(defaultExportedName.identifier))
        ? defaultExportedName
        : undefined,
    namedExports,
  };

  return exportInfo;
}
