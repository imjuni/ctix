import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';

export interface IExportStatement {
  path: {
    /**
     * export statement가 있던 소스코드 파일
     */
    filename: string;

    /**
     * export statement가 있던 소스코드 파 디렉터리일
     */
    dirPath: string;

    /**
     * rootDir 또는 output 경로와 sourceFilePath까지 상대 경로
     */
    relativePath: string;
  };

  pos: {
    line: number;
    column: number;
  };

  /**
   * 정렬에 사용할 디렉터리 깊이 정보
   */
  depth: number;

  /**
   * default export 여부
   */
  isDefault: boolean;

  /**
   * export 할 때 사용된 이름
   */
  identifier: {
    /** export 할 때 사용된 이름, default는 default가 입력된다 */
    name: string;

    /** export를 alias할 때 사용할 이름, default에서 사용되며 파일이름이 사용된다 */
    alias: string;
  };

  /**
   * "type" 키워드를 적용할 수 있는지 구문인지 아닌지 표시
   */
  isPureType: boolean;

  /**
   * `export default () => {}` 와 같이 익명 export 구문인지 표시
   */
  isAnonymous: boolean;

  /**
   * inline comment를 사용해서 exclude를 한 것인지 표시
   */
  isExcluded: boolean;

  /**
   * inline comment에 @ctix-exclude-next 를 추가한 경우, 그 주석에 대한 정보
   */
  comments: IInlineExcludeInfo[];
}
