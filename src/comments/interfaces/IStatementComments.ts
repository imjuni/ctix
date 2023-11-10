import type * as tsm from 'ts-morph';

export interface IStatementComments {
  // comment kind
  kind: tsm.SyntaxKind.MultiLineCommentTrivia | tsm.SyntaxKind.SingleLineCommentTrivia;

  // position: location of the statement commented on
  pos: {
    /** inline exclude 키워드가 몇 번째 line에 있는가 */
    line: number;
    /** inline exclude 키워드가 몇 번째 col에 있는가 */
    column: number;
    /** exclude 키워드가 포함된 statement의 위치 */
    start: number;
  };

  filePath: string;

  // comment
  range: string;
}
