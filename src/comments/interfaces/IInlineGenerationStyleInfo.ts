import type { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';

export interface IInlineGenerationStyleInfo {
  /** 주석 내용 */
  commentCode: string;

  /** 소스 파일 경로 */
  filePath: string;

  /** export 생성 스타일 */
  style: CE_GENERATION_STYLE;

  pos: {
    /** inline exclude 키워드가 몇 번째 line에 있는가 */
    line: number;
    /** inline exclude 키워드가 몇 번째 col에 있는가 */
    column: number;
    /** exclude 키워드가 포함된 statement의 위치 */
    start: number;
  };

  /**
   * 사용자가 style comment에 namespace를 지정한 경우, namespace
   *
   * If the user specified a workspace in the `exclude style`, the `workspace`
   * */
  workspaces?: string[];
}
