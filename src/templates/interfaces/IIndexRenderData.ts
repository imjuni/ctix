import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';

export interface IIndexRenderData {
  options: {
    /** Type of quote character
     * 따옴표 종류 */
    quote: string;

    /** Whether to add semicolon
     * 세미콜론 추가 여부 */
    useSemicolon: boolean;
  };

  /** File path
   * 파일 경로 */
  filePath: string;

  statement: {
    /**
     * import 구문을 생성할 때 from 절 이 후에 붙는 경로
     * 경로는 re-map path 또는 절대 경로등을 사용하지 않고, rootDir의 relative path로 작성한다
     * */
    importPath: string;

    /** File extension
     * 파일 확장자 */
    extname: {
      /** Original extension
       * 원본 확장자 */
      origin: string;

      /** Extension for rendering
       * 렌더링용 확장자 */
      render: string;
    };

    /** Whether the file has a default export
     * default export를 가지고 있는가 여부 */
    isHasDefault: boolean;

    /** Whether some export statements in named exports are included in exclude
     * named export에서 일부 export statement가 exclude에 포함되어 있는가 */
    isHasPartialExclude: boolean;

    /** Default export statement information
     * default export statemt 정보 */
    default?: IExportStatement;

    /** Named export statements information
     * named export statements 정보 */
    named: IExportStatement[];
  };
}
