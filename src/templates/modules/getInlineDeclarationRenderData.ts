import type { getInlineCommentedFiles } from '#/comments/getInlineCommentedFiles';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { getExtname } from '#/modules/path/getExtname';
import { getImportStatementExtname } from '#/modules/path/getImportStatementExtname';
import { posixRelative } from '#/modules/path/modules/posixRelative';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import pathe from 'pathe';
import type { SetOptional } from 'type-fest';

export function getInlineDeclarationRenderData(
  declarations: ReturnType<typeof getInlineCommentedFiles>,
  options: SetOptional<Pick<TBundleOptions, 'output' | 'fileExt'>, 'output'>,
) {
  const renderDatas = declarations.map((declaration) => {
    const extname = getExtname(declaration.filePath);
    const renderExtname = getImportStatementExtname(options.fileExt, extname);
    const dirname = pathe.dirname(declaration.filePath);
    const basename = pathe.basename(declaration.filePath, extname);

    const relativePath =
      options.output != null
        ? addCurrentDirPrefix(posixRelative(options.output, pathe.join(dirname, basename)))
        : replaceSepToPosix(`.${path.posix.sep}${pathe.join(dirname, basename)}`);

    return {
      ...declaration,
      relativePath,
      extname: {
        origin: extname,
        render: renderExtname,
      },
    };
  });

  return renderDatas;
}
