import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { ICommandBundleOptions } from '#/configs/interfaces/ICommandBundleOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { getExtname } from '#/modules/path/getExtname';
import { getImportStatementExtname } from '#/modules/path/getImportStatementExtname';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import path from 'node:path';

export function getRenderData(
  option: Pick<
    ICommonGenerateOptions & ICommandBundleOptions,
    'fileExt' | 'quote' | 'useSemicolon'
  >,
  filePath: string,
  statements: IExportStatement[],
  output?: string,
): IIndexRenderData | undefined {
  const included = statements.filter((statement) => !statement.isIgnored);

  if (included.length <= 0) {
    return undefined;
  }

  const isHasPartialIgnore = statements.length !== included.length;
  const defaultExport = included.find((statement) => !statement.isIgnored && statement.isDefault);
  const extname = getExtname(filePath);
  const renderExtname = getImportStatementExtname(option.fileExt, extname);
  const filename = filePath.replace(new RegExp(`${extname}$`), '');
  const relativePath =
    output != null
      ? addCurrentDirPrefix(path.relative(output, filename))
      : `.${path.posix.sep}${path.basename(filename, getExtname(filePath))}`;

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
      isHasPartialIgnore,
      default: defaultExport,
      named: statements.filter((statement) => !statement.isIgnored && !statement.isDefault),
    },
  } satisfies IIndexRenderData;
}