import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineCommented } from '#/comments/getInlineCommented';
import { getNodeComments } from '#/comments/getNodeComments';
import type { IInlineCommentInfo } from '#/comments/interfaces/IInlineCommentInfo';
import { getExportedKind } from '#/compilers/getExportedKind';
import { getStatementAlias } from '#/compilers/getStatementAlias';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { getRelativeDepth } from '#/modules/path/getRelativeDepth';
import type * as tsm from 'ts-morph';

export function getSummaryStatement(params: {
  node: tsm.ExportedDeclarations;
  project: string;
  identifier?: string;
  alias?: string;
  eol: string;
  path: IExportStatement['path'];
  isDefault?: boolean;
}): IExportStatement {
  const kind = getExportedKind(params.node);
  const filenamified = filenamify(params.path.filename);
  const identifier = params.identifier ?? kind.name ?? filenamified;
  const comments = getNodeComments(params.node, params.identifier)
    .map((comment) =>
      getInlineCommented({
        comment,
        options: {
          keyword: CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
        },
      }),
    )
    .filter((comment): comment is IInlineCommentInfo => comment != null);

  const pos = params.node.getSourceFile().getLineAndColumnAtPos(params.node.getStart(false));

  return {
    path: params.path,
    depth: getRelativeDepth(params.project, params.path.dirPath),
    pos,
    identifier: {
      name: identifier,
      alias: getStatementAlias({
        kind,
        filenamified,
        alias: params.alias,
        isDefault: params.isDefault,
      }),
    },
    isPureType: kind.isPureType,
    isAnonymous: kind.name == null,
    isDefault: params.isDefault ?? false,
    isExcluded: comments.length > 0,
    comments,
  } satisfies IExportStatement;
}
