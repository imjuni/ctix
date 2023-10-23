export interface IDocumentComment {
  line: number;
  kind: 'file' | 'statement';
  keywordPos: { line: number; pos: number };
  content: string;
  namespace?: string;
}
