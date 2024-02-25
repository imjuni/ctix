import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeTsGenerateOptions } from '#/configs/interfaces/IModeTsGenerateOptions';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { getExtname } from '#/modules/path/getExtname';
import { getImportStatementExtname } from '#/modules/path/getImportStatementExtname';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

export function getRenderData(
  option: Pick<
    IModeGenerateOptions & IModeTsGenerateOptions & IModeBundleOptions,
    'fileExt' | 'quote' | 'useSemicolon'
  >,
  filePath: string,
  statements: IExportStatement[],
  output?: string,
): IIndexRenderData | undefined {
  const included = statements.filter((statement) => !statement.isExcluded);

  if (included.length <= 0) {
    return undefined;
  }

  const isHasPartialExclude = statements.length !== included.length;
  const defaultExport = included.find((statement) => !statement.isExcluded && statement.isDefault);
  const extname = getExtname(filePath);
  const renderExtname = getImportStatementExtname(option.fileExt, extname);
  const filename = filePath.replace(new RegExp(`${extname}$`), '');
  const relativePath =
    output != null
      ? replaceSepToPosix(addCurrentDirPrefix(path.relative(output, filename)))
      : replaceSepToPosix(`.${path.posix.sep}${path.basename(filename, getExtname(filePath))}`);

  return {
    options: {
      quote: option.quote,
      useSemicolon: option.useSemicolon,
    },
    filePath,
    statement: {
      extname: {
        origin: extname,
        render: renderExtname,
      },
      importPath: relativePath,
      isHasDefault: defaultExport != null,
      isHasPartialExclude,
      default: defaultExport,
      named: statements.filter((statement) => !statement.isExcluded && !statement.isDefault),
    },
  } satisfies IIndexRenderData;
}
