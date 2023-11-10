import { getCommentKind } from '#/comments/getCommentKind';
import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import type * as tsm from 'ts-morph';

export function getNodeComments(node: tsm.Node<tsm.ts.Node>): IStatementComments[] {
  const start = node.getStart();
  const lineAndPos = node.getSourceFile().getLineAndColumnAtPos(start);
  const leadingComment = node.getLeadingCommentRanges();

  if (leadingComment != null && leadingComment.length > 0) {
    return leadingComment.map((range) => {
      const kind: IStatementComments['kind'] = getCommentKind(range.getKind());

      return {
        pos: { start, ...lineAndPos },
        range: range.getText(),
        filePath: node.getSourceFile().getFilePath().toString(),
        kind,
      };
    });
  }

  return [];
}
