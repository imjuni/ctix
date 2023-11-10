import * as tsm from 'ts-morph';

export function getCommentKind(kind: tsm.SyntaxKind) {
  switch (kind) {
    case tsm.SyntaxKind.MultiLineCommentTrivia:
      return tsm.SyntaxKind.MultiLineCommentTrivia;
    default:
      return tsm.SyntaxKind.SingleLineCommentTrivia;
  }
}
