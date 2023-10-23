export interface IInlineIgnoreInfo {
  /** 주석 내용 */
  commentCode: string;

  /** inline ignore 키워드가 몇 번째 col에 있는가 */
  pos: number;

  /** inline ignore 키워드가 몇 번째 line에 있는가 */
  line: number;

  /** 사용자가 ignore에 namespace를 지정한 경우, namespace */
  namespaces?: string[];
}
