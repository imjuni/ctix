import type { IStatementComments } from '#/comments/interfaces/IStatementComments';

export interface ISourceFileComments {
  filePath: string;
  comments: IStatementComments[];
}
