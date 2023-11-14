import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { getExtname } from '#/modules/path/getExtname';
import { getRelativeDepth } from '#/modules/path/getRelativeDepth';
import type { IIndexRenderData } from '#/templates/interfaces/IIndexRenderData';
import { getDirname } from 'my-node-fp';
import path from 'node:path';

export async function getModuleRenderData(
  option: Pick<IModeGenerateOptions & IModeBundleOptions, 'project' | 'quote' | 'useSemicolon'>,
  filePath: string,
  output: string,
): Promise<IIndexRenderData | undefined> {
  const extname = getExtname(filePath);
  const renderExtname = extname;
  const filename = path.basename(filePath).replace(new RegExp(`${extname}$`), '');
  const dirPath = await getDirname(filePath);
  const relativePath = addCurrentDirPrefix(
    path.relative(await getDirname(output), await getDirname(filePath)),
  );

  const defaultExport: IExportStatement = {
    path: {
      filename,
      dirPath,
      relativePath,
    },
    pos: {
      line: 1,
      column: 1,
    },
    depth: getRelativeDepth(option.project, dirPath),
    isDefault: true,
    identifier: {
      name: filename,
      alias: filename,
    },
    isPureType: false,
    isAnonymous: false,
    isExcluded: false,
    comments: [],
  };

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
      isHasDefault: true,
      isHasPartialExclude: false,
      default: defaultExport,
      named: [],
    },
  } satisfies IIndexRenderData;
}
