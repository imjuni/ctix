import { CE_INLINE_EXCLUDE_KEYWORD } from '#/comments/const-enum/CE_INLINE_EXCLUDE_KEYWORD';
import { getInlineExclude } from '#/comments/getInlineExclude';
import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';
import { getExportedKind } from '#/compilers/getExportedKind';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { getRelativeDepth } from '#/modules/path/getRelativeDepth';
import type * as tsm from 'ts-morph';

export function getSummaryStatement(params: {
  node: tsm.ExportedDeclarations;
  project: string;
  identifier?: string;
  eol: string;
  path: IExportStatement['path'];
  isDefault?: boolean;
}): IExportStatement {
  const kind = getExportedKind(params.node);
  const filenamified = filenamify(params.path.filename);
  const identifier = params.identifier ?? kind.name ?? filenamified;
  const comments = params.node
    .getLeadingCommentRanges()
    .map((comment) =>
      getInlineExclude(comment.getText(), {
        eol: params.eol,
        keyword: CE_INLINE_EXCLUDE_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
      }),
    )
    .filter((comment): comment is IInlineExcludeInfo => comment != null);

  const pos = params.node.getSourceFile().getLineAndColumnAtPos(params.node.getStart(false));

  return {
    path: params.path,
    depth: getRelativeDepth(params.project, params.path.dirPath),
    pos,
    identifier: {
      name: identifier,
      alias: params.isDefault ? kind.name ?? filenamified : filenamified,
    },
    isPureType: kind.isPureType,
    isAnonymous: kind.name == null,
    isDefault: params.isDefault ?? false,
    isExcluded: comments.length > 0,
    comments,
  } satisfies IExportStatement;
}
