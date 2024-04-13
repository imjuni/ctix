import type { IInlineCommentInfo } from '#/comments/interfaces/IInlineCommentInfo';

export interface IExcludeFile {
  filePath: string;
  fileExcludeComment: IInlineCommentInfo[];
  firstExcludeComment?: IInlineCommentInfo;
  excluded: boolean;
}
