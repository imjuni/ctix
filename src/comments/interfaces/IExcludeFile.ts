import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';

export interface IExcludeFile {
  filePath: string;
  fileExcludeComment: IInlineExcludeInfo[];
  firstExcludeComment?: IInlineExcludeInfo;
  excluded: boolean;
}
