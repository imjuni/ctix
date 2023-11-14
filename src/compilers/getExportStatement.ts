import { getExportedKind } from '#/compilers/getExportedKind';
import { getSummaryStatement } from '#/compilers/getSummaryStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { getDirname, replaceSepToPosix, startSepRemove } from 'my-node-fp';
import path from 'node:path';
import * as tsm from 'ts-morph';

export async function getExportStatement(
  sourceFile: tsm.SourceFile,
  option: Pick<IModeGenerateOptions, 'project' | 'exportFilename'>,
  extendOptions: Pick<IExtendOptions, 'eol'>,
): Promise<IExportStatement[]> {
  const dirPath = replaceSepToPosix(
    path.resolve(await getDirname(sourceFile.getFilePath().toString())),
  );
  const filename = startSepRemove(
    sourceFile.getFilePath().toString().replace(dirPath, ''),
    path.sep,
  );
  // rootDir 또는 output, project 셋 중에 하나를 선택해서 써야 한다
  const relativePath = path.relative(await getDirname(option.project), dirPath);

  const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
  const defaultExportedDeclarations = exportedDeclarationsMap.get('default')?.at(0);

  const defaultExportedName =
    defaultExportedDeclarations != null
      ? [
          getSummaryStatement({
            path: { filename, dirPath, relativePath },
            identifier: 'default',
            node: defaultExportedDeclarations,
            eol: extendOptions.eol,
            project: option.project,
            isDefault: true,
          }),
        ]
      : [];

  const namedExports = Array.from(exportedDeclarationsMap.entries())
    .filter(([identifier]) => identifier !== 'default')
    .map((exportedDeclarationsWithKey) => {
      const [exportedDeclarationKey, exportedDeclarations] = exportedDeclarationsWithKey;
      const [exportedDeclaration] = exportedDeclarations;
      const kind = getExportedKind(exportedDeclaration);

      // 모듈일 때 왜 패턴을 하는지 잘 모르겠다
      // declare module "react" {} 같은 것을 할 때 패턴이 발견될 리가 없는데...
      // example08번 때문이네...
      if (exportedDeclaration.getKind() === tsm.SyntaxKind.ModuleDeclaration && kind.name != null) {
        return getSummaryStatement({
          path: { filename, dirPath, relativePath },
          identifier: exportedDeclarationKey,
          node: exportedDeclaration,
          project: option.project,
          eol: extendOptions.eol,
          isDefault: false,
        });
      }

      if (exportedDeclaration.getKind() === tsm.SyntaxKind.SourceFile) {
        return getSummaryStatement({
          path: { filename, dirPath, relativePath },
          identifier: exportedDeclarationKey,
          node: exportedDeclaration,
          project: option.project,
          eol: extendOptions.eol,
          isDefault: false,
        });
      }

      return getSummaryStatement({
        path: { filename, dirPath, relativePath },
        node: exportedDeclaration,
        project: option.project,
        eol: extendOptions.eol,
        isDefault: false,
      });
    });

  return [...defaultExportedName, ...namedExports];
}
