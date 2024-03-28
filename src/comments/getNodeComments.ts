import { getCommentKind } from '#/comments/getCommentKind';
import { getCommentsWithParent } from '#/comments/getCommentsWithParent';
import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import { getExportAssignmentMap } from '#/compilers/getExportAssignmentMap';
import type * as tsm from 'ts-morph';

export function getNodeComments(
  node: tsm.Node<tsm.ts.Node>,
  identifier?: string,
): IStatementComments[] {
  const start = node.getStart();
  const lineAndPos = node.getSourceFile().getLineAndColumnAtPos(start);
  const exportAssignmentMap = getExportAssignmentMap(node.getSourceFile());
  const exportAssignment = identifier != null ? exportAssignmentMap.get(identifier) : undefined;

  const leadingComment =
    exportAssignment != null
      ? getCommentsWithParent(exportAssignment)
      : getCommentsWithParent(node);

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
