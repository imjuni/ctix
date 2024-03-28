import * as tsm from 'ts-morph';

export function getCommentsWithParent(node: tsm.Node<tsm.ts.Node>): tsm.CommentRange[] {
  if (node.getKind() === tsm.SyntaxKind.VariableDeclaration) {
    const parent = node.getParent();
    const grandParent = parent?.getParent();

    const parentComments =
      parent?.getKind() === tsm.SyntaxKind.VariableDeclarationList
        ? parent.getLeadingCommentRanges()
        : [];

    const grandParentComments =
      grandParent?.getKind() === tsm.SyntaxKind.VariableStatement
        ? grandParent.getLeadingCommentRanges()
        : [];

    return [...grandParentComments, ...parentComments, ...node.getLeadingCommentRanges()];
  }

  return node.getLeadingCommentRanges();
}
