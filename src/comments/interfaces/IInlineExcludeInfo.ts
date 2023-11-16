export interface IInlineExcludeInfo {
  /** 주석 내용 */
  commentCode: string;

  /** 소스 파일 경로 */
  filePath: string;

  /** tag of exclude comment */
  tag: string;

  pos: {
    /** inline exclude 키워드가 몇 번째 line에 있는가 */
    line: number;
    /** inline exclude 키워드가 몇 번째 col에 있는가 */
    column: number;
    /** exclude 키워드가 포함된 statement의 위치 */
    start: number;
  };

  /**
   * 사용자가 exclude에 workspace를 지정한 경우, workspace
   *
   * If the user specified a workspace in the `exclude comment`, the `workspace`
   * */
  workspaces?: string[];
}
