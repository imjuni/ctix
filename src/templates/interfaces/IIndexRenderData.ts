import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';

export interface IIndexRenderData {
  options: {
    /** 따옴표 종류 */
    quote: string;

    /** 세미콜론 추가 여부 */
    useSemicolon: boolean;
  };

  /** 파일 경로 */
  filePath: string;

  statement: {
    /**
     * import 구문을 생성할 때 from 절 이 후에 붙는 경로
     * 경로는 re-map path 또는 절대 경로등을 사용하지 않고, rootDir의 relative path로 작성한다
     * */
    importPath: string;

    /** 파일 확장자 */
    extname: {
      /** 원본 확장자 */
      origin: string;

      /** 렌더링용 확장자 */
      render: string;
    };

    /** default export를 가지고 있는가 여부 */
    isHasDefault: boolean;

    /** named export에서 일부 export statement가 ignore에 포함되어 있는가 */
    isHasPartialIgnore: boolean;

    /** default export statemt 정보 */
    default?: IExportStatement;

    /** named export statements 정보 */
    named: IExportStatement[];
  };
}
