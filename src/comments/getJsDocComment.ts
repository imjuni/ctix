import * as tsm from 'ts-morph';

export function getJsDocComment(
  kind: tsm.SyntaxKind.MultiLineCommentTrivia | tsm.SyntaxKind.SingleLineCommentTrivia,
  comment: string,
) {
  if (kind === tsm.SyntaxKind.SingleLineCommentTrivia) {
    return `/**${comment.trim().replace(/(\/\/)(\/|)/, '')} */`;
  }

  if (!/^\/\*\*/.test(comment.trim())) {
    return comment.trim().replace(/\/\*/, '/**');
  }

  return comment;
}
