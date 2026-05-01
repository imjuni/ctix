import type * as tsm from 'ts-morph';

export interface IStatementComments {
  // comment kind
  kind: tsm.SyntaxKind.MultiLineCommentTrivia | tsm.SyntaxKind.SingleLineCommentTrivia;

  // position: location of the statement commented on
  pos: {
    /** Which line number the inline exclude keyword is on
     * inline exclude 키워드가 몇 번째 line에 있는가 */
    line: number;
    /** Which column number the inline exclude keyword is on
     * inline exclude 키워드가 몇 번째 col에 있는가 */
    column: number;
    /** Position of the statement containing the exclude keyword
     * exclude 키워드가 포함된 statement의 위치 */
    start: number;
  };

  filePath: string;

  // comment
  range: string;
}
